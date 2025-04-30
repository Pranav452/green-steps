-- Create tables for GreenSteps application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create eco_actions table
CREATE TABLE IF NOT EXISTS eco_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  points DECIMAL(5,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  total_points DECIMAL(10,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_logs table
CREATE TABLE IF NOT EXISTS user_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  action_id UUID NOT NULL REFERENCES eco_actions(id),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, action_id, date)
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  required_points DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  badge_id UUID NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Insert predefined eco-actions
INSERT INTO eco_actions (name, emoji, points, description) VALUES
('Carpooling', '♻️', 1.5, 'Shared a ride instead of driving alone'),
('Reused Container', '🔁', 1, 'Used a reusable container instead of disposable'),
('Skipped Meat', '🍽️', 2, 'Chose a plant-based meal'),
('Used Public Transport', '🚲', 1.5, 'Took public transportation instead of driving'),
('No-Plastic Day', '🛍️', 2, 'Avoided single-use plastics for the day'),
('Others (Custom)', '📝', 1, 'Other eco-friendly action')
ON CONFLICT DO NOTHING;

-- Insert predefined badges
INSERT INTO badges (name, description, image_url, required_points) VALUES
('Eco Starter', 'You''ve started your eco-friendly journey!', '🌱', 10),
('Green Enthusiast', 'You''re making consistent eco-friendly choices!', '🌿', 50),
('Earth Champion', 'You''re a true champion for the planet!', '🌍', 100)
ON CONFLICT DO NOTHING;

-- Create function to update user profile when a new log is added
CREATE OR REPLACE FUNCTION update_user_profile_on_log()
RETURNS TRIGGER AS $$
DECLARE
  action_points DECIMAL(5,2);
  current_date DATE := CURRENT_DATE;
  yesterday DATE := current_date - INTERVAL '1 day';
  has_yesterday_log BOOLEAN;
BEGIN
  -- Get points for the action
  SELECT points INTO action_points FROM eco_actions WHERE id = NEW.action_id;
  
  -- Update total points
  UPDATE user_profiles
  SET total_points = total_points + action_points
  WHERE id = NEW.user_id;
  
  -- Check if user has a log from yesterday
  SELECT EXISTS (
    SELECT 1 FROM user_logs 
    WHERE user_id = NEW.user_id AND date = yesterday
  ) INTO has_yesterday_log;
  
  -- Update streak
  IF has_yesterday_log THEN
    -- Continue streak
    UPDATE user_profiles
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(current_streak + 1, longest_streak)
    WHERE id = NEW.user_id;
  ELSE
    -- Reset streak to 1 (today's log)
    UPDATE user_profiles
    SET current_streak = 1
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating user profile
CREATE TRIGGER update_user_profile_after_log
AFTER INSERT ON user_logs
FOR EACH ROW
EXECUTE FUNCTION update_user_profile_on_log();

-- Create function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  badge_record RECORD;
BEGIN
  -- Check each badge to see if user qualifies
  FOR badge_record IN 
    SELECT * FROM badges 
    WHERE required_points <= NEW.total_points
  LOOP
    -- Insert badge if user doesn't already have it
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (NEW.id, badge_record.id)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for awarding badges
CREATE TRIGGER award_badges_after_profile_update
AFTER UPDATE OF total_points ON user_profiles
FOR EACH ROW
WHEN (NEW.total_points > OLD.total_points)
EXECUTE FUNCTION check_and_award_badges();

-- Create function to create user profile after registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Create RLS (Row Level Security) policies

-- Enable RLS on all tables
ALTER TABLE eco_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
-- eco_actions: Everyone can read
CREATE POLICY "Anyone can read eco_actions"
  ON eco_actions FOR SELECT
  USING (true);

-- user_profiles: Users can only read their own profile
CREATE POLICY "Users can only read their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- user_logs: Users can only read and insert their own logs
CREATE POLICY "Users can only read their own logs"
  ON user_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own logs"
  ON user_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- badges: Everyone can read
CREATE POLICY "Anyone can read badges"
  ON badges FOR SELECT
  USING (true);

-- user_badges: Users can only read their own badges
CREATE POLICY "Users can only read their own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);
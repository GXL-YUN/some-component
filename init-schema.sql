-- 宠觅 App 数据库初始化脚本
-- PostgreSQL 15
-- 使用方法: docker exec -i postgres15 psql -U postgres -d petdb < init-schema.sql

-- ===== 用户端表 =====

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  nickname VARCHAR(100),
  avatar_url VARCHAR(500),
  points INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS users_phone_idx ON users(phone);

-- 收货地址表
CREATE TABLE IF NOT EXISTS addresses (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_name VARCHAR(50) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  detail_address VARCHAR(200) NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS addresses_user_id_idx ON addresses(user_id);

-- 买宠需求表
CREATE TABLE IF NOT EXISTS demands (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_type VARCHAR(20) NOT NULL, -- cat, dog
  breed VARCHAR(50) NOT NULL,
  gender VARCHAR(10), -- male, female
  color VARCHAR(50),
  age_min INTEGER, -- 月龄
  age_max INTEGER,
  vaccine_required BOOLEAN DEFAULT true,
  budget_min NUMERIC(10, 2),
  budget_max NUMERIC(10, 2),
  address_id VARCHAR(36) REFERENCES addresses(id),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, quoted, completed, expired
  quotes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS demands_user_id_idx ON demands(user_id);
CREATE INDEX IF NOT EXISTS demands_status_idx ON demands(status);
CREATE INDEX IF NOT EXISTS demands_created_at_idx ON demands(created_at DESC);

-- 宠物档案表
CREATE TABLE IF NOT EXISTS pets (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  pet_type VARCHAR(20) NOT NULL, -- cat, dog
  breed VARCHAR(50) NOT NULL,
  gender VARCHAR(10) NOT NULL, -- male, female
  birthday TIMESTAMP WITH TIME ZONE,
  photo_url VARCHAR(500),
  color VARCHAR(50),
  weight NUMERIC(10, 2),
  sterilized BOOLEAN,
  chip_number VARCHAR(50),
  personality VARCHAR(500),
  vaccine_records JSONB,
  deworming_records JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS pets_user_id_idx ON pets(user_id);

-- 成长记录表
CREATE TABLE IF NOT EXISTS pet_records (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id VARCHAR(36) NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  record_type VARCHAR(20) NOT NULL, -- weight, bath, medical, vaccine, deworming, other
  record_date TIMESTAMP WITH TIME ZONE NOT NULL,
  value NUMERIC(10, 2), -- 体重值等
  unit VARCHAR(10), -- kg, cm
  description TEXT,
  note TEXT, -- 备注
  photos JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS pet_records_pet_id_idx ON pet_records(pet_id);
CREATE INDEX IF NOT EXISTS pet_records_record_date_idx ON pet_records(record_date DESC);

-- 宠物相册表
CREATE TABLE IF NOT EXISTS pet_photos (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id VARCHAR(36) NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  photo_key VARCHAR(500) NOT NULL, -- 存储在对象存储中的 key
  photo_url VARCHAR(500), -- 签名 URL（可选，用于临时访问）
  description TEXT, -- 照片描述
  sort_order INTEGER DEFAULT 0, -- 排序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS pet_photos_pet_id_idx ON pet_photos(pet_id);

-- 门店表
CREATE TABLE IF NOT EXISTS stores (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  photos JSONB,
  address VARCHAR(200) NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  phone VARCHAR(20),
  rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
  reviews_count INTEGER DEFAULT 0 NOT NULL,
  distance NUMERIC(10, 2), -- km
  opening_hours VARCHAR(50),
  is_open BOOLEAN DEFAULT true NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS stores_rating_idx ON stores(rating DESC);

-- 服务项目表
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id VARCHAR(36) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration INTEGER, -- 分钟
  photos JSONB,
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS services_store_id_idx ON services(store_id);

-- 预约表
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id VARCHAR(36) NOT NULL REFERENCES stores(id),
  service_id VARCHAR(36) NOT NULL REFERENCES services(id),
  pet_id VARCHAR(36) REFERENCES pets(id),
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, confirmed, completed, cancelled
  note TEXT,
  price NUMERIC(10, 2) NOT NULL,
  verification_code VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_store_id_idx ON appointments(store_id);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);
CREATE INDEX IF NOT EXISTS appointments_appointment_time_idx ON appointments(appointment_time);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  quote_id VARCHAR(36) REFERENCES quotes(id),
  order_type VARCHAR(20) NOT NULL, -- pet, grooming
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, paid, delivering, in_service, completed, cancelled
  total_amount NUMERIC(10, 2) NOT NULL,
  deposit_amount NUMERIC(10, 2),
  paid_amount NUMERIC(10, 2),
  address_id VARCHAR(36) REFERENCES addresses(id),
  health_report_url VARCHAR(500),
  logistics_info JSONB,
  appointment_id VARCHAR(36) REFERENCES appointments(id),
  appointment_time TIMESTAMP WITH TIME ZONE, -- 预约时间
  verification_code VARCHAR(20), -- 核销码
  appointment JSONB, -- 洗护预约信息快照
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_quote_id_idx ON orders(quote_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

-- 报价表
CREATE TABLE IF NOT EXISTS quotes (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  demand_id VARCHAR(36) NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
  merchant_id VARCHAR(36) NOT NULL,
  merchant_name VARCHAR(100) NOT NULL,
  merchant_avatar VARCHAR(500),
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  photos JSONB,
  videos JSONB,
  vaccine_records JSONB, -- VaccineRecord[]
  deworming_records JSONB, -- DewormingRecord[]
  birth_certificate VARCHAR(500),
  merchant_rating NUMERIC(3, 2) DEFAULT 5.00,
  distance NUMERIC(10, 2), -- km
  status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, accepted, rejected, cancelled
  -- 商家报价新增字段
  pet_name VARCHAR(50),
  pet_gender VARCHAR(10),
  pet_age_months INTEGER,
  pet_color VARCHAR(50),
  vaccine_status VARCHAR(20),
  deworming_status VARCHAR(20),
  health_guarantee_days INTEGER,
  contact_name VARCHAR(50),
  contact_phone VARCHAR(20),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS quotes_demand_id_idx ON quotes(demand_id);
CREATE INDEX IF NOT EXISTS quotes_merchant_id_idx ON quotes(merchant_id);
CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes(status);

-- ===== 商家端表 =====

-- 商家表
CREATE TABLE IF NOT EXISTS merchants (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100),
  avatar_url VARCHAR(500),
  type VARCHAR(20) NOT NULL, -- breeder, grooming, both
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, certified, rejected, banned
  business_license_url VARCHAR(500),
  id_card_front_url VARCHAR(500),
  id_card_back_url VARCHAR(500),
  environment_photos JSONB,
  live_pet_license_url VARCHAR(500),
  certification_submitted_at TIMESTAMP WITH TIME ZONE,
  certification_verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  address VARCHAR(200),
  description TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  orders_count INTEGER DEFAULT 0,
  quotes_count INTEGER DEFAULT 0,
  balance NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS merchants_phone_idx ON merchants(phone);
CREATE INDEX IF NOT EXISTS merchants_status_idx ON merchants(status);
CREATE INDEX IF NOT EXISTS merchants_type_idx ON merchants(type);

-- 商家认证记录表
CREATE TABLE IF NOT EXISTS merchant_certifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id VARCHAR(36) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  certification_type VARCHAR(20) NOT NULL, -- initial, renewal
  business_license_url VARCHAR(500),
  id_card_front_url VARCHAR(500),
  id_card_back_url VARCHAR(500),
  environment_photos JSONB,
  live_pet_license_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
  rejection_reason TEXT,
  reviewer_id VARCHAR(36),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS merchant_certifications_merchant_id_idx ON merchant_certifications(merchant_id);
CREATE INDEX IF NOT EXISTS merchant_certifications_status_idx ON merchant_certifications(status);

-- 检疫证明表
CREATE TABLE IF NOT EXISTS quarantine_certificates (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  merchant_id VARCHAR(36) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  certificate_no VARCHAR(50) NOT NULL,
  certificate_url VARCHAR(500),
  issue_date TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  issued_by VARCHAR(100),
  status VARCHAR(20) DEFAULT 'valid' NOT NULL, -- valid, expired, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS quarantine_certificates_order_id_idx ON quarantine_certificates(order_id);
CREATE INDEX IF NOT EXISTS quarantine_certificates_merchant_id_idx ON quarantine_certificates(merchant_id);
CREATE INDEX IF NOT EXISTS quarantine_certificates_certificate_no_idx ON quarantine_certificates(certificate_no);

-- 商家银行账户表
CREATE TABLE IF NOT EXISTS merchant_bank_accounts (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id VARCHAR(36) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  bank_name VARCHAR(50) NOT NULL,
  account_name VARCHAR(100) NOT NULL,
  account_no VARCHAR(50) NOT NULL,
  bank_branch VARCHAR(100),
  is_default BOOLEAN DEFAULT false NOT NULL,
  status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, disabled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS merchant_bank_accounts_merchant_id_idx ON merchant_bank_accounts(merchant_id);

-- 商家提现记录表
CREATE TABLE IF NOT EXISTS merchant_withdrawals (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id VARCHAR(36) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  bank_account_id VARCHAR(36) REFERENCES merchant_bank_accounts(id),
  amount NUMERIC(10, 2) NOT NULL,
  fee NUMERIC(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, processing, completed, failed
  failed_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS merchant_withdrawals_merchant_id_idx ON merchant_withdrawals(merchant_id);
CREATE INDEX IF NOT EXISTS merchant_withdrawals_status_idx ON merchant_withdrawals(status);

-- ===== 洗护商家相关表 =====

-- 洗护商家门店信息表
CREATE TABLE IF NOT EXISTS grooming_stores (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id VARCHAR(36) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  address VARCHAR(200) NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  opening_hours VARCHAR(100), -- "09:00-21:00"
  service_range VARCHAR(50), -- 服务范围描述
  description TEXT,
  photos JSONB,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  reviews_count INTEGER DEFAULT 0,
  is_open BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS grooming_stores_merchant_id_idx ON grooming_stores(merchant_id);

-- 洗护服务项目表（支持按体型定价）
CREATE TABLE IF NOT EXISTS grooming_services (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id VARCHAR(36) NOT NULL REFERENCES grooming_stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- 普洗/精洗/美容/SPA
  category VARCHAR(50) NOT NULL, -- wash, grooming, spa
  description TEXT,
  -- 按体型定价: { small: 50, medium: 80, large: 120 }
  price_config JSONB NOT NULL,
  duration INTEGER NOT NULL, -- 服务时长（分钟）
  available_slots JSONB, -- 可用时段 ["09:00", "10:00", ...]
  photos JSONB,
  is_available BOOLEAN DEFAULT true NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS grooming_services_store_id_idx ON grooming_services(store_id);
CREATE INDEX IF NOT EXISTS grooming_services_category_idx ON grooming_services(category);

-- 美容师资质表
CREATE TABLE IF NOT EXISTS groomer_certificates (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id VARCHAR(36) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  groomer_name VARCHAR(50) NOT NULL,
  certificate_type VARCHAR(50) NOT NULL, -- C级/B级/A级/CKU等
  certificate_no VARCHAR(100),
  certificate_url VARCHAR(500),
  issue_date TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'valid' NOT NULL, -- valid, expired
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS groomer_certificates_merchant_id_idx ON groomer_certificates(merchant_id);

-- 预约改期记录表
CREATE TABLE IF NOT EXISTS appointment_reschedules (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id VARCHAR(36) NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  original_time TIMESTAMP WITH TIME ZONE NOT NULL,
  new_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  request_by VARCHAR(20) NOT NULL, -- user, merchant
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS appointment_reschedules_appointment_id_idx ON appointment_reschedules(appointment_id);

-- 预约取消记录表
CREATE TABLE IF NOT EXISTS appointment_cancellations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id VARCHAR(36) NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  cancelled_by VARCHAR(20) NOT NULL, -- user, merchant
  reason TEXT,
  refund_amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS appointment_cancellations_appointment_id_idx ON appointment_cancellations(appointment_id);

-- 核销记录表
CREATE TABLE IF NOT EXISTS verifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id VARCHAR(36) NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  store_id VARCHAR(36) NOT NULL,
  verification_code VARCHAR(20) NOT NULL,
  verified_by VARCHAR(36), -- 商家ID
  verify_method VARCHAR(20) NOT NULL, -- scan, manual
  status VARCHAR(20) DEFAULT 'success' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS verifications_appointment_id_idx ON verifications(appointment_id);
CREATE INDEX IF NOT EXISTS verifications_verification_code_idx ON verifications(verification_code);

-- ===== 健康检查表 =====
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

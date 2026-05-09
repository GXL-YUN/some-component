-- ============================================
-- 宠觅 App - Supabase 数据库初始化脚本（修复版）
-- ============================================
-- 使用方法：
-- 1. 打开 Supabase Dashboard -> SQL Editor
-- 2. 复制此脚本并粘贴
-- 3. 点击 Run 执行
-- ============================================

-- ===== 用户端表 =====

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  nickname VARCHAR(100),
  avatar_url TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS users_phone_idx ON users(phone);

-- 收货地址表
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_name VARCHAR(50) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  detail_address VARCHAR(200) NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS addresses_user_id_idx ON addresses(user_id);

-- 买宠需求表
CREATE TABLE IF NOT EXISTS demands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_type VARCHAR(20) NOT NULL CHECK (pet_type IN ('cat', 'dog')),
  breed VARCHAR(50) NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  color VARCHAR(50),
  age_min INTEGER,
  age_max INTEGER,
  vaccine_required BOOLEAN DEFAULT true,
  budget_min NUMERIC(10, 2),
  budget_max NUMERIC(10, 2),
  address_id UUID REFERENCES addresses(id),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'quoted', 'completed', 'expired')),
  quotes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS demands_user_id_idx ON demands(user_id);
CREATE INDEX IF NOT EXISTS demands_status_idx ON demands(status);
CREATE INDEX IF NOT EXISTS demands_created_at_idx ON demands(created_at DESC);

-- 宠物档案表
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  pet_type VARCHAR(20) NOT NULL CHECK (pet_type IN ('cat', 'dog')),
  breed VARCHAR(50) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  birthday TIMESTAMPTZ,
  photo_url TEXT,
  color VARCHAR(50),
  weight NUMERIC(10, 2),
  sterilized BOOLEAN,
  chip_number VARCHAR(50),
  personality VARCHAR(500),
  vaccine_records JSONB,
  deworming_records JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS pets_user_id_idx ON pets(user_id);

-- 成长记录表
CREATE TABLE IF NOT EXISTS pet_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('weight', 'bath', 'medical', 'vaccine', 'deworming', 'other')),
  record_date TIMESTAMPTZ NOT NULL,
  value NUMERIC(10, 2),
  unit VARCHAR(10),
  description TEXT,
  note TEXT,
  photos JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS pet_records_pet_id_idx ON pet_records(pet_id);
CREATE INDEX IF NOT EXISTS pet_records_record_date_idx ON pet_records(record_date DESC);

-- 宠物相册表
CREATE TABLE IF NOT EXISTS pet_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  photo_key VARCHAR(500) NOT NULL,
  photo_url TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS pet_photos_pet_id_idx ON pet_photos(pet_id);

-- 商家表（先创建，因为其他表引用它）
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100),
  avatar_url TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('breeder', 'grooming', 'both')),
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'certified', 'rejected', 'banned')),
  business_license_url TEXT,
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  environment_photos JSONB,
  live_pet_license_url TEXT,
  certification_submitted_at TIMESTAMPTZ,
  certification_verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  address VARCHAR(200),
  description TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
  orders_count INTEGER DEFAULT 0,
  quotes_count INTEGER DEFAULT 0,
  balance NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS merchants_phone_idx ON merchants(phone);
CREATE INDEX IF NOT EXISTS merchants_status_idx ON merchants(status);
CREATE INDEX IF NOT EXISTS merchants_type_idx ON merchants(type);

-- 报价表（先创建，因为 orders 引用它）
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demand_id UUID NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  merchant_name VARCHAR(100) NOT NULL,
  merchant_avatar TEXT,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  photos JSONB,
  videos JSONB,
  vaccine_records JSONB,
  deworming_records JSONB,
  birth_certificate TEXT,
  merchant_rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (merchant_rating >= 0 AND merchant_rating <= 5),
  distance NUMERIC(10, 2),
  status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'accepted', 'rejected', 'cancelled')),
  pet_name VARCHAR(50),
  pet_gender VARCHAR(10) CHECK (pet_gender IN ('male', 'female')),
  pet_age_months INTEGER,
  pet_color VARCHAR(50),
  vaccine_status VARCHAR(20),
  deworming_status VARCHAR(20),
  health_guarantee_days INTEGER,
  contact_name VARCHAR(50),
  contact_phone VARCHAR(20),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS quotes_demand_id_idx ON quotes(demand_id);
CREATE INDEX IF NOT EXISTS quotes_merchant_id_idx ON quotes(merchant_id);
CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes(status);

-- 门店表
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  photos JSONB,
  address VARCHAR(200) NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  phone VARCHAR(20),
  rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0 NOT NULL,
  distance NUMERIC(10, 2),
  opening_hours VARCHAR(50),
  is_open BOOLEAN DEFAULT true NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS stores_rating_idx ON stores(rating DESC);

-- 服务项目表
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration INTEGER,
  photos JSONB,
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS services_store_id_idx ON services(store_id);

-- 预约表
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id),
  service_id UUID NOT NULL REFERENCES services(id),
  pet_id UUID REFERENCES pets(id),
  appointment_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  note TEXT,
  price NUMERIC(10, 2) NOT NULL,
  verification_code VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_store_id_idx ON appointments(store_id);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);
CREATE INDEX IF NOT EXISTS appointments_appointment_time_idx ON appointments(appointment_time);

-- 订单表（暂时不添加 quote_id 外键，避免循环依赖）
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  quote_id UUID, -- 外键在后面单独添加
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('pet', 'grooming')),
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid', 'delivering', 'in_service', 'completed', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL,
  deposit_amount NUMERIC(10, 2),
  paid_amount NUMERIC(10, 2),
  address_id UUID REFERENCES addresses(id),
  health_report_url TEXT,
  logistics_info JSONB,
  appointment_id UUID REFERENCES appointments(id),
  appointment_time TIMESTAMPTZ,
  verification_code VARCHAR(20),
  appointment JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_quote_id_idx ON orders(quote_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

-- ===== 商家端相关表 =====

-- 商家认证记录表
CREATE TABLE IF NOT EXISTS merchant_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  certification_type VARCHAR(20) NOT NULL CHECK (certification_type IN ('initial', 'renewal')),
  business_license_url TEXT,
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  environment_photos JSONB,
  live_pet_license_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewer_id UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS merchant_certifications_merchant_id_idx ON merchant_certifications(merchant_id);
CREATE INDEX IF NOT EXISTS merchant_certifications_status_idx ON merchant_certifications(status);

-- 检疫证明表
CREATE TABLE IF NOT EXISTS quarantine_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  certificate_no VARCHAR(50) NOT NULL,
  certificate_url TEXT,
  issue_date TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  issued_by VARCHAR(100),
  status VARCHAR(20) DEFAULT 'valid' NOT NULL CHECK (status IN ('valid', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS quarantine_certificates_order_id_idx ON quarantine_certificates(order_id);
CREATE INDEX IF NOT EXISTS quarantine_certificates_merchant_id_idx ON quarantine_certificates(merchant_id);
CREATE INDEX IF NOT EXISTS quarantine_certificates_certificate_no_idx ON quarantine_certificates(certificate_no);

-- 商家银行账户表
CREATE TABLE IF NOT EXISTS merchant_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  bank_name VARCHAR(50) NOT NULL,
  account_name VARCHAR(100) NOT NULL,
  account_no VARCHAR(50) NOT NULL,
  bank_branch VARCHAR(100),
  is_default BOOLEAN DEFAULT false NOT NULL,
  status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'disabled')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS merchant_bank_accounts_merchant_id_idx ON merchant_bank_accounts(merchant_id);

-- 商家提现记录表
CREATE TABLE IF NOT EXISTS merchant_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES merchant_bank_accounts(id),
  amount NUMERIC(10, 2) NOT NULL,
  fee NUMERIC(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  failed_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS merchant_withdrawals_merchant_id_idx ON merchant_withdrawals(merchant_id);
CREATE INDEX IF NOT EXISTS merchant_withdrawals_status_idx ON merchant_withdrawals(status);

-- ===== 洗护商家相关表 =====

-- 洗护商家门店信息表
CREATE TABLE IF NOT EXISTS grooming_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  address VARCHAR(200) NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  opening_hours VARCHAR(100),
  service_range VARCHAR(50),
  description TEXT,
  photos JSONB,
  rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  is_open BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS grooming_stores_merchant_id_idx ON grooming_stores(merchant_id);

-- 洗护服务项目表
CREATE TABLE IF NOT EXISTS grooming_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES grooming_stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('wash', 'grooming', 'spa')),
  description TEXT,
  price_config JSONB NOT NULL,
  duration INTEGER NOT NULL,
  available_slots JSONB,
  photos JSONB,
  is_available BOOLEAN DEFAULT true NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS grooming_services_store_id_idx ON grooming_services(store_id);
CREATE INDEX IF NOT EXISTS grooming_services_category_idx ON grooming_services(category);

-- 美容师资质表
CREATE TABLE IF NOT EXISTS groomer_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  groomer_name VARCHAR(50) NOT NULL,
  certificate_type VARCHAR(50) NOT NULL,
  certificate_no VARCHAR(100),
  certificate_url TEXT,
  issue_date TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'valid' NOT NULL CHECK (status IN ('valid', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS groomer_certificates_merchant_id_idx ON groomer_certificates(merchant_id);

-- 预约改期记录表
CREATE TABLE IF NOT EXISTS appointment_reschedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  original_time TIMESTAMPTZ NOT NULL,
  new_time TIMESTAMPTZ NOT NULL,
  reason TEXT,
  request_by VARCHAR(20) NOT NULL CHECK (request_by IN ('user', 'merchant')),
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS appointment_reschedules_appointment_id_idx ON appointment_reschedules(appointment_id);

-- 预约取消记录表
CREATE TABLE IF NOT EXISTS appointment_cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  cancelled_by VARCHAR(20) NOT NULL CHECK (cancelled_by IN ('user', 'merchant')),
  reason TEXT,
  refund_amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS appointment_cancellations_appointment_id_idx ON appointment_cancellations(appointment_id);

-- 核销记录表
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  store_id UUID NOT NULL,
  verification_code VARCHAR(20) NOT NULL,
  verified_by UUID,
  verify_method VARCHAR(20) NOT NULL CHECK (verify_method IN ('scan', 'manual')),
  status VARCHAR(20) DEFAULT 'success' NOT NULL CHECK (status IN ('success', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS verifications_appointment_id_idx ON verifications(appointment_id);
CREATE INDEX IF NOT EXISTS verifications_verification_code_idx ON verifications(verification_code);

-- 健康检查表
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 最后添加 orders.quote_id 的外键（避免循环依赖）=====
ALTER TABLE orders ADD CONSTRAINT orders_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL;

-- ===== 启用行级安全策略 (RLS) =====
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarantine_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE grooming_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE grooming_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE groomer_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reschedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_cancellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

-- ===== 创建 RLS 策略（公开读写模式）=====
DROP POLICY IF EXISTS "Enable all access for users" ON users;
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for addresses" ON addresses;
CREATE POLICY "Enable all access for addresses" ON addresses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for demands" ON demands;
CREATE POLICY "Enable all access for demands" ON demands FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for pets" ON pets;
CREATE POLICY "Enable all access for pets" ON pets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for pet_records" ON pet_records;
CREATE POLICY "Enable all access for pet_records" ON pet_records FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for pet_photos" ON pet_photos;
CREATE POLICY "Enable all access for pet_photos" ON pet_photos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for merchants" ON merchants;
CREATE POLICY "Enable all access for merchants" ON merchants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for merchant_certifications" ON merchant_certifications;
CREATE POLICY "Enable all access for merchant_certifications" ON merchant_certifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for quarantine_certificates" ON quarantine_certificates;
CREATE POLICY "Enable all access for quarantine_certificates" ON quarantine_certificates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for merchant_bank_accounts" ON merchant_bank_accounts;
CREATE POLICY "Enable all access for merchant_bank_accounts" ON merchant_bank_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for merchant_withdrawals" ON merchant_withdrawals;
CREATE POLICY "Enable all access for merchant_withdrawals" ON merchant_withdrawals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for stores" ON stores;
CREATE POLICY "Enable all access for stores" ON stores FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for services" ON services;
CREATE POLICY "Enable all access for services" ON services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for appointments" ON appointments;
CREATE POLICY "Enable all access for appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for orders" ON orders;
CREATE POLICY "Enable all access for orders" ON orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for quotes" ON quotes;
CREATE POLICY "Enable all access for quotes" ON quotes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for grooming_stores" ON grooming_stores;
CREATE POLICY "Enable all access for grooming_stores" ON grooming_stores FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for grooming_services" ON grooming_services;
CREATE POLICY "Enable all access for grooming_services" ON grooming_services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for groomer_certificates" ON groomer_certificates;
CREATE POLICY "Enable all access for groomer_certificates" ON groomer_certificates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for appointment_reschedules" ON appointment_reschedules;
CREATE POLICY "Enable all access for appointment_reschedules" ON appointment_reschedules FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for appointment_cancellations" ON appointment_cancellations;
CREATE POLICY "Enable all access for appointment_cancellations" ON appointment_cancellations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for verifications" ON verifications;
CREATE POLICY "Enable all access for verifications" ON verifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for health_check" ON health_check;
CREATE POLICY "Enable all access for health_check" ON health_check FOR ALL USING (true) WITH CHECK (true);

-- ===== 完成 =====

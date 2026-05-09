import { pgTable, serial, timestamp, varchar, integer, boolean, text, numeric, jsonb, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable("users", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	phone: varchar("phone", { length: 20 }).notNull().unique(),
	nickname: varchar("nickname", { length: 100 }),
	avatar_url: varchar("avatar_url", { length: 500 }),
	points: integer("points").default(0).notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("users_phone_idx").on(table.phone),
]);

// 收货地址表
export const addresses = pgTable("addresses", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
	receiver_name: varchar("receiver_name", { length: 50 }).notNull(),
	receiver_phone: varchar("receiver_phone", { length: 20 }).notNull(),
	province: varchar("province", { length: 50 }).notNull(),
	city: varchar("city", { length: 50 }).notNull(),
	district: varchar("district", { length: 50 }).notNull(),
	detail_address: varchar("detail_address", { length: 200 }).notNull(),
	is_default: boolean("is_default").default(false).notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("addresses_user_id_idx").on(table.user_id),
]);

// 买宠需求表
export const demands = pgTable("demands", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
	pet_type: varchar("pet_type", { length: 20 }).notNull(), // cat, dog
	breed: varchar("breed", { length: 50 }).notNull(),
	gender: varchar("gender", { length: 10 }), // male, female
	color: varchar("color", { length: 50 }),
	age_min: integer("age_min"), // 月龄
	age_max: integer("age_max"),
	vaccine_required: boolean("vaccine_required").default(true),
	budget_min: numeric("budget_min", { precision: 10, scale: 2 }),
	budget_max: numeric("budget_max", { precision: 10, scale: 2 }),
	address_id: varchar("address_id", { length: 36 }).references(() => addresses.id),
	description: text("description"),
	status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, quoted, completed, expired
	quotes_count: integer("quotes_count").default(0).notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("demands_user_id_idx").on(table.user_id),
	index("demands_status_idx").on(table.status),
	index("demands_created_at_idx").on(table.created_at),
]);

// 疫苗记录类型
export interface VaccineRecord {
  name: string;
  date: string;
  dose: number;
  total_doses: number;
}

// 驱虫记录类型
export interface DewormingRecord {
  type: string;
  date: string;
  medicine: string;
}

// 报价表
export const quotes = pgTable("quotes", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	demand_id: varchar("demand_id", { length: 36 }).notNull().references(() => demands.id),
	merchant_id: varchar("merchant_id", { length: 36 }).notNull(),
	merchant_name: varchar("merchant_name", { length: 100 }).notNull(),
	merchant_avatar: varchar("merchant_avatar", { length: 500 }),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	description: text("description"),
	photos: jsonb("photos").$type<string[]>(),
	videos: jsonb("videos").$type<string[]>(),
	vaccine_records: jsonb("vaccine_records").$type<VaccineRecord[]>(),
	deworming_records: jsonb("deworming_records").$type<DewormingRecord[]>(),
	birth_certificate: varchar("birth_certificate", { length: 500 }),
	merchant_rating: numeric("merchant_rating", { precision: 3, scale: 2 }).default('5.00'),
	distance: numeric("distance", { precision: 10, scale: 2 }), // km
	status: varchar("status", { length: 20 }).default('active').notNull(), // active, accepted, rejected, cancelled
	// 商家报价新增字段
	pet_name: varchar("pet_name", { length: 50 }),
	pet_gender: varchar("pet_gender", { length: 10 }),
	pet_age_months: integer("pet_age_months"),
	pet_color: varchar("pet_color", { length: 50 }),
	vaccine_status: varchar("vaccine_status", { length: 20 }),
	deworming_status: varchar("deworming_status", { length: 20 }),
	health_guarantee_days: integer("health_guarantee_days"),
	contact_name: varchar("contact_name", { length: 50 }),
	contact_phone: varchar("contact_phone", { length: 20 }),
	view_count: integer("view_count").default(0),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("quotes_demand_id_idx").on(table.demand_id),
	index("quotes_merchant_id_idx").on(table.merchant_id),
	index("quotes_status_idx").on(table.status),
]);

// 门店表
export const stores = pgTable("stores", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	name: varchar("name", { length: 100 }).notNull(),
	logo_url: varchar("logo_url", { length: 500 }),
	photos: jsonb("photos").$type<string[]>(),
	address: varchar("address", { length: 200 }).notNull(),
	latitude: numeric("latitude", { precision: 10, scale: 7 }),
	longitude: numeric("longitude", { precision: 10, scale: 7 }),
	phone: varchar("phone", { length: 20 }),
	rating: numeric("rating", { precision: 3, scale: 2 }).default('5.00').notNull(),
	reviews_count: integer("reviews_count").default(0).notNull(),
	distance: numeric("distance", { precision: 10, scale: 2 }), // km
	opening_hours: varchar("opening_hours", { length: 50 }),
	is_open: boolean("is_open").default(true).notNull(),
	description: text("description"),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("stores_rating_idx").on(table.rating),
]);

// 服务项目表
export const services = pgTable("services", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	store_id: varchar("store_id", { length: 36 }).notNull().references(() => stores.id),
	name: varchar("name", { length: 100 }).notNull(),
	description: text("description"),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	duration: integer("duration"), // 分钟
	photos: jsonb("photos").$type<string[]>(),
	is_available: boolean("is_available").default(true).notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("services_store_id_idx").on(table.store_id),
]);

// 预约表
export const appointments = pgTable("appointments", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
	store_id: varchar("store_id", { length: 36 }).notNull().references(() => stores.id),
	service_id: varchar("service_id", { length: 36 }).notNull().references(() => services.id),
	pet_id: varchar("pet_id", { length: 36 }),
	appointment_time: timestamp("appointment_time", { withTimezone: true }).notNull(),
	status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, confirmed, completed, cancelled
	note: text("note"),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	verification_code: varchar("verification_code", { length: 10 }),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("appointments_user_id_idx").on(table.user_id),
	index("appointments_store_id_idx").on(table.store_id),
	index("appointments_status_idx").on(table.status),
	index("appointments_appointment_time_idx").on(table.appointment_time),
]);

// 订单表
export const orders = pgTable("orders", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
	quote_id: varchar("quote_id", { length: 36 }).references(() => quotes.id), // 洗护订单可能没有quote
	order_type: varchar("order_type", { length: 20 }).notNull(), // pet, grooming
	status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, paid, delivering, in_service, completed, cancelled
	total_amount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
	deposit_amount: numeric("deposit_amount", { precision: 10, scale: 2 }),
	paid_amount: numeric("paid_amount", { precision: 10, scale: 2 }),
	address_id: varchar("address_id", { length: 36 }).references(() => addresses.id),
	health_report_url: varchar("health_report_url", { length: 500 }),
	logistics_info: jsonb("logistics_info"),
	appointment_id: varchar("appointment_id", { length: 36 }).references(() => appointments.id), // 洗护预约ID
	appointment_time: timestamp("appointment_time", { withTimezone: true }), // 预约时间
	verification_code: varchar("verification_code", { length: 20 }), // 核销码
	appointment: jsonb("appointment").$type<{
		service_name: string;
		store_name: string;
		appointment_time: string;
	}>(), // 洗护预约信息快照
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("orders_user_id_idx").on(table.user_id),
	index("orders_quote_id_idx").on(table.quote_id),
	index("orders_status_idx").on(table.status),
	index("orders_created_at_idx").on(table.created_at),
]);

// 宠物档案表
export const pets = pgTable("pets", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
	name: varchar("name", { length: 50 }).notNull(),
	pet_type: varchar("pet_type", { length: 20 }).notNull(), // cat, dog
	breed: varchar("breed", { length: 50 }).notNull(),
	gender: varchar("gender", { length: 10 }).notNull(), // male, female
	birthday: timestamp("birthday", { withTimezone: true }),
	photo_url: varchar("photo_url", { length: 500 }),
	vaccine_records: jsonb("vaccine_records"),
	deworming_records: jsonb("deworming_records"),
	description: text("description"),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("pets_user_id_idx").on(table.user_id),
]);

// 成长记录表
export const petRecords = pgTable("pet_records", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	pet_id: varchar("pet_id", { length: 36 }).notNull().references(() => pets.id),
	record_type: varchar("record_type", { length: 20 }).notNull(), // weight, bath, medical, vaccine, deworming, other
	record_date: timestamp("record_date", { withTimezone: true }).notNull(),
	value: numeric("value", { precision: 10, scale: 2 }), // 体重值等
	unit: varchar("unit", { length: 10 }), // kg, cm
	description: text("description"),
	note: text("note"), // 备注
	photos: jsonb("photos").$type<string[]>(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	index("pet_records_pet_id_idx").on(table.pet_id),
	index("pet_records_record_date_idx").on(table.record_date),
]);

// ===== 商家端表 =====

// 商家表
export const merchants = pgTable("merchants", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	phone: varchar("phone", { length: 20 }).notNull().unique(),
	name: varchar("name", { length: 100 }),
	avatar_url: varchar("avatar_url", { length: 500 }),
	type: varchar("type", { length: 20 }).notNull(), // breeder, grooming, both
	status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, certified, rejected, banned
	business_license_url: varchar("business_license_url", { length: 500 }),
	id_card_front_url: varchar("id_card_front_url", { length: 500 }),
	id_card_back_url: varchar("id_card_back_url", { length: 500 }),
	environment_photos: jsonb("environment_photos").$type<string[]>(),
	live_pet_license_url: varchar("live_pet_license_url", { length: 500 }),
	certification_submitted_at: timestamp("certification_submitted_at", { withTimezone: true }),
	certification_verified_at: timestamp("certification_verified_at", { withTimezone: true }),
	rejection_reason: text("rejection_reason"),
	province: varchar("province", { length: 50 }),
	city: varchar("city", { length: 50 }),
	district: varchar("district", { length: 50 }),
	address: varchar("address", { length: 200 }),
	description: text("description"),
	rating: numeric("rating", { precision: 3, scale: 2 }).default('5.00'),
	orders_count: integer("orders_count").default(0),
	quotes_count: integer("quotes_count").default(0),
	balance: numeric("balance", { precision: 10, scale: 2 }).default('0'),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("merchants_phone_idx").on(table.phone),
	index("merchants_status_idx").on(table.status),
	index("merchants_type_idx").on(table.type),
]);

// 商家认证记录表
export const merchantCertifications = pgTable("merchant_certifications", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	merchant_id: varchar("merchant_id", { length: 36 }).notNull().references(() => merchants.id),
	certification_type: varchar("certification_type", { length: 20 }).notNull(), // initial, renewal
	business_license_url: varchar("business_license_url", { length: 500 }),
	id_card_front_url: varchar("id_card_front_url", { length: 500 }),
	id_card_back_url: varchar("id_card_back_url", { length: 500 }),
	environment_photos: jsonb("environment_photos").$type<string[]>(),
	live_pet_license_url: varchar("live_pet_license_url", { length: 500 }),
	status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, approved, rejected
	rejection_reason: text("rejection_reason"),
	reviewer_id: varchar("reviewer_id", { length: 36 }),
	reviewed_at: timestamp("reviewed_at", { withTimezone: true }),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	index("merchant_certifications_merchant_id_idx").on(table.merchant_id),
	index("merchant_certifications_status_idx").on(table.status),
]);

// 检疫证明表
export const quarantineCertificates = pgTable("quarantine_certificates", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	order_id: varchar("order_id", { length: 36 }).notNull().references(() => orders.id),
	merchant_id: varchar("merchant_id", { length: 36 }).notNull().references(() => merchants.id),
	certificate_no: varchar("certificate_no", { length: 50 }).notNull(),
	certificate_url: varchar("certificate_url", { length: 500 }),
	issue_date: timestamp("issue_date", { withTimezone: true }),
	valid_until: timestamp("valid_until", { withTimezone: true }),
	issued_by: varchar("issued_by", { length: 100 }),
	status: varchar("status", { length: 20 }).default('valid').notNull(), // valid, expired, cancelled
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	index("quarantine_certificates_order_id_idx").on(table.order_id),
	index("quarantine_certificates_merchant_id_idx").on(table.merchant_id),
	index("quarantine_certificates_certificate_no_idx").on(table.certificate_no),
]);

// 商家银行账户表
export const merchantBankAccounts = pgTable("merchant_bank_accounts", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	merchant_id: varchar("merchant_id", { length: 36 }).notNull().references(() => merchants.id),
	bank_name: varchar("bank_name", { length: 50 }).notNull(),
	account_name: varchar("account_name", { length: 100 }).notNull(),
	account_no: varchar("account_no", { length: 50 }).notNull(),
	bank_branch: varchar("bank_branch", { length: 100 }),
	is_default: boolean("is_default").default(false).notNull(),
	status: varchar("status", { length: 20 }).default('active').notNull(), // active, disabled
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("merchant_bank_accounts_merchant_id_idx").on(table.merchant_id),
]);

// 商家提现记录表
export const merchantWithdrawals = pgTable("merchant_withdrawals", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	merchant_id: varchar("merchant_id", { length: 36 }).notNull().references(() => merchants.id),
	bank_account_id: varchar("bank_account_id", { length: 36 }).references(() => merchantBankAccounts.id),
	amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
	fee: numeric("fee", { precision: 10, scale: 2 }).default('0'),
	status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, processing, completed, failed
	failed_reason: text("failed_reason"),
	completed_at: timestamp("completed_at", { withTimezone: true }),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("merchant_withdrawals_merchant_id_idx").on(table.merchant_id),
	index("merchant_withdrawals_status_idx").on(table.status),
]);

// ===== 洗护商家相关表 =====

// 洗护商家门店信息表
export const groomingStores = pgTable("grooming_stores", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	merchant_id: varchar("merchant_id", { length: 36 }).notNull().references(() => merchants.id),
	name: varchar("name", { length: 100 }).notNull(),
	logo_url: varchar("logo_url", { length: 500 }),
	phone: varchar("phone", { length: 20 }).notNull(),
	province: varchar("province", { length: 50 }).notNull(),
	city: varchar("city", { length: 50 }).notNull(),
	district: varchar("district", { length: 50 }).notNull(),
	address: varchar("address", { length: 200 }).notNull(),
	latitude: numeric("latitude", { precision: 10, scale: 7 }),
	longitude: numeric("longitude", { precision: 10, scale: 7 }),
	opening_hours: varchar("opening_hours", { length: 100 }), // "09:00-21:00"
	service_range: varchar("service_range", { length: 50 }), // 服务范围描述
	description: text("description"),
	photos: jsonb("photos").$type<string[]>(),
	rating: numeric("rating", { precision: 3, scale: 2 }).default('5.00'),
	reviews_count: integer("reviews_count").default(0),
	is_open: boolean("is_open").default(true).notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("grooming_stores_merchant_id_idx").on(table.merchant_id),
]);

// 洗护服务项目表（支持按体型定价）
export const groomingServices = pgTable("grooming_services", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	store_id: varchar("store_id", { length: 36 }).notNull().references(() => groomingStores.id),
	name: varchar("name", { length: 100 }).notNull(), // 普洗/精洗/美容/SPA
	category: varchar("category", { length: 50 }).notNull(), // wash, grooming, spa
	description: text("description"),
	// 按体型定价: { small: 50, medium: 80, large: 120 }
	price_config: jsonb("price_config").$type<{
		small?: number;
		medium?: number;
		large?: number;
	}>().notNull(),
	duration: integer("duration").notNull(), // 服务时长（分钟）
	available_slots: jsonb("available_slots").$type<string[]>(), // 可用时段 ["09:00", "10:00", ...]
	photos: jsonb("photos").$type<string[]>(),
	is_available: boolean("is_available").default(true).notNull(),
	sort_order: integer("sort_order").default(0),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	index("grooming_services_store_id_idx").on(table.store_id),
	index("grooming_services_category_idx").on(table.category),
]);

// 美容师资质表
export const groomerCertificates = pgTable("groomer_certificates", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	merchant_id: varchar("merchant_id", { length: 36 }).notNull().references(() => merchants.id),
	groomer_name: varchar("groomer_name", { length: 50 }).notNull(),
	certificate_type: varchar("certificate_type", { length: 50 }).notNull(), // C级/B级/A级/CKU等
	certificate_no: varchar("certificate_no", { length: 100 }),
	certificate_url: varchar("certificate_url", { length: 500 }),
	issue_date: timestamp("issue_date", { withTimezone: true }),
	valid_until: timestamp("valid_until", { withTimezone: true }),
	status: varchar("status", { length: 20 }).default('valid').notNull(), // valid, expired
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	index("groomer_certificates_merchant_id_idx").on(table.merchant_id),
]);

// 预约改期记录表
export const appointmentReschedules = pgTable("appointment_reschedules", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	appointment_id: varchar("appointment_id", { length: 36 }).notNull().references(() => appointments.id),
	original_time: timestamp("original_time", { withTimezone: true }).notNull(),
	new_time: timestamp("new_time", { withTimezone: true }).notNull(),
	reason: text("reason"),
	request_by: varchar("request_by", { length: 20 }).notNull(), // user, merchant
	status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, approved, rejected
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	processed_at: timestamp("processed_at", { withTimezone: true }),
}, (table) => [
	index("appointment_reschedules_appointment_id_idx").on(table.appointment_id),
]);

// 预约取消记录表
export const appointmentCancellations = pgTable("appointment_cancellations", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	appointment_id: varchar("appointment_id", { length: 36 }).notNull().references(() => appointments.id),
	cancelled_by: varchar("cancelled_by", { length: 20 }).notNull(), // user, merchant
	reason: text("reason"),
	refund_amount: numeric("refund_amount", { precision: 10, scale: 2 }),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	index("appointment_cancellations_appointment_id_idx").on(table.appointment_id),
]);

// 核销记录表
export const verifications = pgTable("verifications", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	appointment_id: varchar("appointment_id", { length: 36 }).notNull().references(() => appointments.id),
	store_id: varchar("store_id", { length: 36 }).notNull(),
	verification_code: varchar("verification_code", { length: 20 }).notNull(),
	verified_by: varchar("verified_by", { length: 36 }), // 商家ID
	verify_method: varchar("verify_method", { length: 20 }).notNull(), // scan, manual
	status: varchar("status", { length: 20 }).default('success').notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	index("verifications_appointment_id_idx").on(table.appointment_id),
	index("verifications_verification_code_idx").on(table.verification_code),
]);

// 宠物相册表
export const petPhotos = pgTable("pet_photos", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	pet_id: varchar("pet_id", { length: 36 }).notNull().references(() => pets.id),
	photo_key: varchar("photo_key", { length: 500 }).notNull(), // 存储在对象存储中的 key
	photo_url: varchar("photo_url", { length: 500 }), // 签名 URL（可选，用于临时访问）
	description: text("description"), // 照片描述
	sort_order: integer("sort_order").default(0), // 排序
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	index("pet_photos_pet_id_idx").on(table.pet_id),
]);

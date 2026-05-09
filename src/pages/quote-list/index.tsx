import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Quote {
  id: string
  merchant_name: string
  merchant_avatar?: string
  price: number
  merchant_rating: number
  distance?: number
  description?: string
  photos?: string[]
  pet_type?: string
  breed?: string
  created_at: string
}

// 模拟数据：不同需求的报价
const mockQuotesData: Record<string, Quote[]> = {
  // 热门需求 hot-1: 英短蓝猫（15个报价）
  'hot-1': [
    { id: 'q1-1', merchant_name: '萌宠家园', price: 3500, merchant_rating: 4.9, distance: 2.5, description: '健康纯种，已打疫苗，包健康', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date().toISOString() },
    { id: 'q1-2', merchant_name: '爱心宠物店', price: 3200, merchant_rating: 4.7, distance: 3.2, description: '活泼可爱，包健康，支持视频看猫', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'q1-3', merchant_name: '猫咪之家', price: 3800, merchant_rating: 4.8, distance: 1.8, description: '血统纯正，可看父母，终身售后', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'q1-4', merchant_name: '宠物乐园', price: 3400, merchant_rating: 4.6, distance: 4.5, description: '家庭繁育，性格温顺，已驱虫', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'q1-5', merchant_name: '喵星人基地', price: 3600, merchant_rating: 4.9, distance: 2.0, description: '冠军血统，带证书，包疫苗', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'q1-6', merchant_name: '蓝猫专卖', price: 3300, merchant_rating: 4.5, distance: 5.0, description: '纯种蓝猫，健康保障', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: 'q1-7', merchant_name: '幸福猫舍', price: 3700, merchant_rating: 4.8, distance: 1.5, description: '优质种猫后代，品相佳', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 21600000).toISOString() },
    { id: 'q1-8', merchant_name: '萌宠世界', price: 3450, merchant_rating: 4.7, distance: 3.8, description: '自家繁育，性格活泼', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 25200000).toISOString() },
    { id: 'q1-9', merchant_name: '猫咪天堂', price: 3550, merchant_rating: 4.6, distance: 2.8, description: '健康可爱，疫苗齐全', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 28800000).toISOString() },
    { id: 'q1-10', merchant_name: '爱宠之家', price: 3650, merchant_rating: 4.9, distance: 1.2, description: '血统纯正，可签健康协议', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 32400000).toISOString() },
    { id: 'q1-11', merchant_name: '精品猫舍', price: 3900, merchant_rating: 5.0, distance: 6.0, description: '赛级品质，品相完美', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 36000000).toISOString() },
    { id: 'q1-12', merchant_name: '宠物精品店', price: 3350, merchant_rating: 4.4, distance: 4.2, description: '健康活泼，性格好', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 39600000).toISOString() },
    { id: 'q1-13', merchant_name: '蓝猫之家', price: 3750, merchant_rating: 4.8, distance: 2.2, description: '纯种蓝猫，包驱虫疫苗', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 43200000).toISOString() },
    { id: 'q1-14', merchant_name: '猫星人乐园', price: 3250, merchant_rating: 4.5, distance: 3.5, description: '健康可爱，家庭饲养', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 46800000).toISOString() },
    { id: 'q1-15', merchant_name: '优品猫舍', price: 3850, merchant_rating: 4.9, distance: 1.0, description: '优质血统，终身质保', pet_type: 'cat', breed: '英短蓝猫', created_at: new Date(Date.now() - 50400000).toISOString() },
  ],
  // 热门需求 hot-2: 柯基犬（12个报价）
  'hot-2': [
    { id: 'q2-1', merchant_name: '狗狗乐园', price: 6500, merchant_rating: 4.8, distance: 4.1, description: '纯种柯基，已驱虫疫苗', pet_type: 'dog', breed: '柯基犬', created_at: new Date().toISOString() },
    { id: 'q2-2', merchant_name: '萌宠世界', price: 5800, merchant_rating: 4.6, distance: 2.0, description: '可爱小短腿，性格活泼', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'q2-3', merchant_name: '宠物之家', price: 7200, merchant_rating: 5.0, distance: 5.5, description: '赛级血统，品相佳', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'q2-4', merchant_name: '柯基专卖店', price: 6200, merchant_rating: 4.7, distance: 1.8, description: '纯种柯基，健康保障', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'q2-5', merchant_name: '萌犬基地', price: 5900, merchant_rating: 4.5, distance: 3.5, description: '家庭繁育，性格温顺', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'q2-6', merchant_name: '宠物乐园', price: 6800, merchant_rating: 4.9, distance: 2.5, description: '优质种犬后代，带证书', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: 'q2-7', merchant_name: '汪星人世界', price: 5500, merchant_rating: 4.4, distance: 4.8, description: '健康活泼，疫苗齐全', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 21600000).toISOString() },
    { id: 'q2-8', merchant_name: '精品犬舍', price: 7000, merchant_rating: 4.8, distance: 3.0, description: '血统纯正，品相优秀', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 25200000).toISOString() },
    { id: 'q2-9', merchant_name: '爱犬之家', price: 6100, merchant_rating: 4.6, distance: 2.2, description: '纯种柯基，包健康', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 28800000).toISOString() },
    { id: 'q2-10', merchant_name: '柯基王国', price: 6400, merchant_rating: 4.7, distance: 1.5, description: '优质小短腿，性格好', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 32400000).toISOString() },
    { id: 'q2-11', merchant_name: '宠物精品店', price: 6600, merchant_rating: 4.9, distance: 3.8, description: '赛级品相，可看父母', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 36000000).toISOString() },
    { id: 'q2-12', merchant_name: '幸福犬舍', price: 5700, merchant_rating: 4.5, distance: 5.0, description: '健康可爱，已驱虫疫苗', pet_type: 'dog', breed: '柯基犬', created_at: new Date(Date.now() - 39600000).toISOString() },
  ],
  // 热门需求 hot-3: 布偶猫（18个报价）
  'hot-3': [
    { id: 'q3-1', merchant_name: '布偶猫舍', price: 11000, merchant_rating: 5.0, distance: 3.5, description: '纯种布偶，颜值爆表', pet_type: 'cat', breed: '布偶猫', created_at: new Date().toISOString() },
    { id: 'q3-2', merchant_name: '猫咪乐园', price: 9500, merchant_rating: 4.9, distance: 2.8, description: '性格温顺，已打疫苗', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'q3-3', merchant_name: '宠物精品店', price: 12800, merchant_rating: 4.7, distance: 6.0, description: '赛级品相，包健康', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'q3-4', merchant_name: '布偶天堂', price: 10500, merchant_rating: 4.8, distance: 2.0, description: '纯种布偶，蓝眼睛', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'q3-5', merchant_name: '喵星人基地', price: 9800, merchant_rating: 4.6, distance: 4.2, description: '性格粘人，颜值高', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'q3-6', merchant_name: '精品猫舍', price: 11500, merchant_rating: 5.0, distance: 1.5, description: '赛级血统，带证书', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: 'q3-7', merchant_name: '宠物乐园', price: 10200, merchant_rating: 4.7, distance: 3.8, description: '纯种布偶，健康活泼', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 21600000).toISOString() },
    { id: 'q3-8', merchant_name: '猫咪之家', price: 9200, merchant_rating: 4.5, distance: 5.5, description: '家庭繁育，性格温顺', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 25200000).toISOString() },
    { id: 'q3-9', merchant_name: '布偶专卖店', price: 10800, merchant_rating: 4.8, distance: 2.5, description: '优质布偶，包疫苗', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 28800000).toISOString() },
    { id: 'q3-10', merchant_name: '爱猫之家', price: 10000, merchant_rating: 4.6, distance: 4.0, description: '纯种布偶，颜值担当', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 32400000).toISOString() },
    { id: 'q3-11', merchant_name: '猫星人世界', price: 11200, merchant_rating: 4.9, distance: 1.2, description: '赛级品质，血统纯正', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 36000000).toISOString() },
    { id: 'q3-12', merchant_name: '幸福猫舍', price: 9600, merchant_rating: 4.7, distance: 3.0, description: '健康可爱，性格好', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 39600000).toISOString() },
    { id: 'q3-13', merchant_name: '优品猫咪', price: 10600, merchant_rating: 4.8, distance: 2.2, description: '纯种布偶，包健康', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 43200000).toISOString() },
    { id: 'q3-14', merchant_name: '萌猫基地', price: 9400, merchant_rating: 4.5, distance: 4.5, description: '家庭饲养，性格粘人', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 46800000).toISOString() },
    { id: 'q3-15', merchant_name: '宠物精品', price: 12000, merchant_rating: 5.0, distance: 5.0, description: '冠军血统，品相完美', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 50400000).toISOString() },
    { id: 'q3-16', merchant_name: '布偶王国', price: 9900, merchant_rating: 4.6, distance: 1.8, description: '纯种布偶，蓝眼睛', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 54000000).toISOString() },
    { id: 'q3-17', merchant_name: '猫咪天堂', price: 10300, merchant_rating: 4.8, distance: 3.2, description: '健康活泼，疫苗齐全', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 57600000).toISOString() },
    { id: 'q3-18', merchant_name: '爱宠猫舍', price: 10700, merchant_rating: 4.9, distance: 2.8, description: '优质布偶，终身质保', pet_type: 'cat', breed: '布偶猫', created_at: new Date(Date.now() - 61200000).toISOString() },
  ],
  // 热门需求 hot-4: 金毛（11个报价）
  'hot-4': [
    { id: 'q4-1', merchant_name: '金毛之家', price: 5000, merchant_rating: 4.8, distance: 3.0, description: '聪明温顺，家庭首选', pet_type: 'dog', breed: '金毛', created_at: new Date().toISOString() },
    { id: 'q4-2', merchant_name: '萌宠世界', price: 4500, merchant_rating: 4.6, distance: 4.5, description: '健康活泼，已驱虫疫苗', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'q4-3', merchant_name: '宠物乐园', price: 5500, merchant_rating: 4.9, distance: 2.2, description: '血统纯正，可办理证书', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'q4-4', merchant_name: '汪星人基地', price: 4800, merchant_rating: 4.5, distance: 5.0, description: '纯种金毛，性格温顺', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'q4-5', merchant_name: '金毛专卖店', price: 5200, merchant_rating: 4.7, distance: 1.8, description: '优质金毛，健康保障', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'q4-6', merchant_name: '精品犬舍', price: 5800, merchant_rating: 4.8, distance: 3.5, description: '赛级血统，品相佳', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: 'q4-7', merchant_name: '爱犬之家', price: 4600, merchant_rating: 4.4, distance: 4.2, description: '家庭繁育，性格活泼', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 21600000).toISOString() },
    { id: 'q4-8', merchant_name: '宠物精品店', price: 5400, merchant_rating: 4.9, distance: 2.0, description: '纯种金毛，包健康', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 25200000).toISOString() },
    { id: 'q4-9', merchant_name: '金毛王国', price: 4900, merchant_rating: 4.6, distance: 3.8, description: '健康可爱，聪明听话', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 28800000).toISOString() },
    { id: 'q4-10', merchant_name: '萌犬乐园', price: 5100, merchant_rating: 4.7, distance: 2.5, description: '优质金毛，疫苗齐全', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 32400000).toISOString() },
    { id: 'q4-11', merchant_name: '幸福犬舍', price: 5300, merchant_rating: 4.8, distance: 1.5, description: '纯种金毛，终身售后', pet_type: 'dog', breed: '金毛', created_at: new Date(Date.now() - 36000000).toISOString() },
  ],
  // 热门需求 hot-5: 美短虎斑（14个报价）
  'hot-5': [
    { id: 'q5-1', merchant_name: '美短猫舍', price: 3200, merchant_rating: 4.8, distance: 1.5, description: '活泼好动，身体健康', pet_type: 'cat', breed: '美短虎斑', created_at: new Date().toISOString() },
    { id: 'q5-2', merchant_name: '猫咪之家', price: 2800, merchant_rating: 4.7, distance: 3.8, description: '经典虎斑纹，品相好', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'q5-3', merchant_name: '宠物精品店', price: 3600, merchant_rating: 4.9, distance: 5.0, description: '血统纯正，已绝育可选', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'q5-4', merchant_name: '美短专卖店', price: 3000, merchant_rating: 4.5, distance: 2.2, description: '纯种美短，健康活泼', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'q5-5', merchant_name: '喵星人基地', price: 3400, merchant_rating: 4.8, distance: 1.8, description: '优质虎斑，性格温顺', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'q5-6', merchant_name: '宠物乐园', price: 2900, merchant_rating: 4.6, distance: 4.0, description: '健康可爱，疫苗齐全', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: 'q5-7', merchant_name: '精品猫舍', price: 3300, merchant_rating: 4.7, distance: 2.5, description: '纯种美短，包健康', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 21600000).toISOString() },
    { id: 'q5-8', merchant_name: '爱猫之家', price: 3100, merchant_rating: 4.5, distance: 3.5, description: '家庭繁育，性格活泼', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 25200000).toISOString() },
    { id: 'q5-9', merchant_name: '猫星人世界', price: 3500, merchant_rating: 4.9, distance: 1.2, description: '赛级品相，带证书', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 28800000).toISOString() },
    { id: 'q5-10', merchant_name: '幸福猫舍', price: 2950, merchant_rating: 4.6, distance: 4.5, description: '健康美短，品相佳', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 32400000).toISOString() },
    { id: 'q5-11', merchant_name: '优品猫咪', price: 3250, merchant_rating: 4.8, distance: 2.0, description: '纯种虎斑，终身售后', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 36000000).toISOString() },
    { id: 'q5-12', merchant_name: '萌猫基地', price: 2850, merchant_rating: 4.4, distance: 5.5, description: '活泼好动，性格好', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 39600000).toISOString() },
    { id: 'q5-13', merchant_name: '美短王国', price: 3050, merchant_rating: 4.7, distance: 3.0, description: '经典虎斑，健康保障', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 43200000).toISOString() },
    { id: 'q5-14', merchant_name: '猫咪天堂', price: 3150, merchant_rating: 4.8, distance: 1.5, description: '优质美短，包疫苗', pet_type: 'cat', breed: '美短虎斑', created_at: new Date(Date.now() - 46800000).toISOString() },
  ],
  // 我的报价需求默认数据
  'default': [
    { id: 'd1', merchant_name: '萌宠家园', price: 3500, merchant_rating: 4.9, distance: 2.5, description: '健康纯种英短，已打疫苗，包健康', created_at: new Date().toISOString() },
    { id: 'd2', merchant_name: '爱心宠物店', price: 4200, merchant_rating: 4.8, distance: 1.2, description: '血统纯正，带证书，终身售后', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'd3', merchant_name: '宠物乐园', price: 3800, merchant_rating: 4.7, distance: 3.8, description: '家庭养殖，性格温顺，支持视频看宠', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'd4', merchant_name: '猫咪之家', price: 3600, merchant_rating: 4.6, distance: 2.0, description: '活泼可爱，疫苗齐全', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'd5', merchant_name: '精品宠物', price: 4000, merchant_rating: 4.9, distance: 4.5, description: '赛级品相，可看父母', created_at: new Date(Date.now() - 14400000).toISOString() },
  ]
}

export default function QuoteListPage() {
  const router = useRouter()
  const demandId = router.params.demandId
  
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'time' | 'price' | 'rating' | 'distance'>('time')
  const [demandInfo, setDemandInfo] = useState<{ breed?: string; pet_type?: string }>({})

  useEffect(() => {
    if (demandId) {
      loadQuotes()
    }
  }, [demandId, sortBy])

  const loadQuotes = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/quotes/demand/${demandId}`,
        method: 'GET',
        data: { sort_by: sortBy }
      })

      console.log('报价列表响应:', res)
      
      const data = res.data?.data || res.data
      
      // 检查是否有有效数据
      if (data && Array.isArray(data) && data.length > 0) {
        setQuotes(data)
        return
      }
      
      // 没有有效数据，使用模拟数据
      throw new Error('暂无报价数据')
    } catch (error) {
      console.error('加载报价列表失败:', error)
      // 根据 demandId 加载对应的模拟数据
      const mockData = mockQuotesData[demandId || ''] || mockQuotesData['default']
      
      // 根据 sortBy 排序
      let sortedData = [...mockData]
      switch (sortBy) {
        case 'price':
          sortedData.sort((a, b) => a.price - b.price)
          break
        case 'rating':
          sortedData.sort((a, b) => b.merchant_rating - a.merchant_rating)
          break
        case 'distance':
          sortedData.sort((a, b) => (a.distance || 0) - (b.distance || 0))
          break
        case 'time':
        default:
          sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }
      
      setQuotes(sortedData)
      
      // 设置需求信息
      if (sortedData.length > 0) {
        setDemandInfo({
          breed: sortedData[0].breed,
          pet_type: sortedData[0].pet_type
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (quoteId: string) => {
    Taro.navigateTo({ url: `/pages/quote-detail/index?quoteId=${quoteId}&demandId=${demandId}` })
  }

  const handleSort = (type: 'time' | 'price' | 'rating' | 'distance') => {
    setSortBy(type)
  }

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`
  }

  const getPetEmoji = (petType?: string) => {
    if (petType === 'cat') return '🐱'
    if (petType === 'dog') return '🐕'
    return '🐾'
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 需求信息头部 */}
      {demandInfo.breed && (
        <View className="bg-gradient-to-r from-orange-500 to-teal-500 px-4 py-3">
          <View className="flex items-center gap-2">
            <Text className="text-2xl">{getPetEmoji(demandInfo.pet_type)}</Text>
            <View>
              <Text className="block text-white font-medium">{demandInfo.breed}</Text>
              <Text className="block text-white text-xs opacity-80">共 {quotes.length} 个商家报价</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* 筛选条件 */}
      <View className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <Button
          size="sm"
          variant={sortBy === 'time' ? 'default' : 'outline'}
          onClick={() => handleSort('time')}
          className="flex-1"
        >
          最新
        </Button>
        <Button
          size="sm"
          variant={sortBy === 'price' ? 'default' : 'outline'}
          onClick={() => handleSort('price')}
          className="flex-1"
        >
          价格低
        </Button>
        <Button
          size="sm"
          variant={sortBy === 'rating' ? 'default' : 'outline'}
          onClick={() => handleSort('rating')}
          className="flex-1"
        >
          评分高
        </Button>
        <Button
          size="sm"
          variant={sortBy === 'distance' ? 'default' : 'outline'}
          onClick={() => handleSort('distance')}
          className="flex-1"
        >
          距离近
        </Button>
      </View>

      {/* 报价列表 */}
      <ScrollView 
        scrollY 
        style={{ height: demandInfo.breed ? 'calc(100vh - 110px)' : 'calc(100vh - 55px)' }}
      >
        <View className="px-4 py-4 pb-20">
          {loading ? (
            <View className="flex items-center justify-center py-12">
              <Text className="text-sm text-gray-500">加载中...</Text>
            </View>
          ) : (
            quotes.map((quote, index) => (
              <Card 
                key={quote.id} 
                className="bg-white shadow-sm mb-3"
                onClick={() => handleViewDetail(quote.id)}
              >
                <CardContent className="p-4">
                  <View className="flex items-start gap-3">
                    {/* 排名 */}
                    {sortBy !== 'time' && index < 3 && (
                      <View
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-600'
                        }`}
                      >
                        <Text className="text-sm font-bold text-white">{index + 1}</Text>
                      </View>
                    )}
                    
                    {/* 商家头像 */}
                    <View
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        quote.pet_type === 'cat' ? 'bg-gradient-to-br from-pink-100 to-pink-200' : 
                        quote.pet_type === 'dog' ? 'bg-gradient-to-br from-orange-100 to-orange-200' :
                        'bg-gradient-to-br from-orange-100 to-teal-100'
                      }`}
                    >
                      <Text className="text-2xl">{getPetEmoji(quote.pet_type)}</Text>
                    </View>
                    
                    <View className="flex-1 min-w-0">
                      {/* 商家名称和评分 */}
                      <View className="flex items-center justify-between mb-2">
                        <View className="flex items-center gap-2">
                          <Text className="block text-base font-medium text-gray-800">
                            {quote.merchant_name}
                          </Text>
                          {quote.merchant_rating >= 4.8 && (
                            <Badge variant="default" className="text-xs">
                              优质商家
                            </Badge>
                          )}
                        </View>
                        <View className="flex items-center gap-1">
                          <Text className="text-sm text-orange-500">⭐</Text>
                          <Text className="text-sm font-medium text-gray-700">
                            {quote.merchant_rating}
                          </Text>
                        </View>
                      </View>
                      
                      {/* 报价信息 */}
                      <View className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        {quote.distance && (
                          <>
                            <Text>距离 {quote.distance}km</Text>
                            <Text>·</Text>
                          </>
                        )}
                        <Text className="text-lg font-bold text-orange-500">
                          {formatPrice(quote.price)}
                        </Text>
                      </View>
                      
                      {/* 描述 */}
                      {quote.description && (
                        <Text className="block text-sm text-gray-600 line-clamp-2 mb-2">
                          {quote.description}
                        </Text>
                      )}
                      
                      {/* 操作按钮 */}
                      <View className="flex items-center justify-between">
                        <Text className="text-xs text-gray-400">
                          {new Date(quote.created_at).toLocaleString('zh-CN', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          查看详情
                        </Button>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))
          )}

          {!loading && quotes.length === 0 && (
            <View className="flex flex-col items-center justify-center py-12">
              <View className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Text className="text-3xl">📦</Text>
              </View>
              <Text className="block text-sm text-gray-500">暂无报价</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

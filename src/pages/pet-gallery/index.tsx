import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface Pet {
  id: string
  name: string
  breed: string
  type: 'cat' | 'dog' | 'other'
  price: number
  originalPrice?: number
  age: string
  gender: string
  features: string[]
  description: string
  emoji: string
  bgColor: string
  merchant: string
  rating: number
  distance: number
  vaccinated: boolean
  dewormed: boolean
}

// 虚拟宠物数据
const mockPets: Pet[] = [
  {
    id: '1',
    name: '蓝猫弟弟',
    breed: '英短蓝猫',
    type: 'cat',
    price: 3500,
    originalPrice: 4500,
    age: '3个月',
    gender: '弟弟',
    features: ['温顺', '圆脸', '粘人'],
    description: '纯种英短蓝猫，圆圆的脸蛋，性格温顺粘人，已打疫苗驱虫',
    emoji: '🐱',
    bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
    merchant: '萌宠家园',
    rating: 4.9,
    distance: 2.5,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '2',
    name: '柯基宝宝',
    breed: '柯基犬',
    type: 'dog',
    price: 5800,
    age: '2个月',
    gender: '妹妹',
    features: ['活泼', '短腿', '可爱'],
    description: '纯种柯基，小短腿蜜桃臀，超级活泼可爱',
    emoji: '🐕',
    bgColor: 'bg-gradient-to-br from-orange-100 to-orange-200',
    merchant: '爱心宠物店',
    rating: 4.8,
    distance: 3.2,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '3',
    name: '布偶仙女',
    breed: '布偶猫',
    type: 'cat',
    price: 12000,
    originalPrice: 15000,
    age: '4个月',
    gender: '妹妹',
    features: ['颜值高', '温顺', '蓝眼'],
    description: '仙女布偶，湛蓝的眼睛，毛发柔软，性格超级温顺',
    emoji: '😺',
    bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
    merchant: '宠物乐园',
    rating: 5.0,
    distance: 1.8,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '4',
    name: '金毛小王子',
    breed: '金毛寻回犬',
    type: 'dog',
    price: 4500,
    age: '3个月',
    gender: '弟弟',
    features: ['聪明', '温顺', '大型犬'],
    description: '纯种金毛，性格温顺聪明，适合家庭饲养',
    emoji: '🦮',
    bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
    merchant: '萌宠世界',
    rating: 4.7,
    distance: 4.1,
    vaccinated: true,
    dewormed: false
  },
  {
    id: '5',
    name: '美短虎斑',
    breed: '美国短毛猫',
    type: 'cat',
    price: 2800,
    age: '2个月',
    gender: '弟弟',
    features: ['活泼', '健康', '经典花纹'],
    description: '经典虎斑花纹，身体强壮，活泼好动',
    emoji: '🐈',
    bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
    merchant: '猫咪之家',
    rating: 4.6,
    distance: 2.0,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '6',
    name: '萨摩耶天使',
    breed: '萨摩耶',
    type: 'dog',
    price: 6500,
    originalPrice: 8000,
    age: '3个月',
    gender: '妹妹',
    features: ['微笑天使', '白色', '温顺'],
    description: '微笑天使萨摩耶，雪白毛发，性格温顺可爱',
    emoji: '🐕‍🦺',
    bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100',
    merchant: '狗狗乐园',
    rating: 4.8,
    distance: 5.5,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '7',
    name: '银渐层',
    breed: '英短银渐层',
    type: 'cat',
    price: 4800,
    age: '3个月',
    gender: '弟弟',
    features: ['稀有', '高贵', '温顺'],
    description: '英短银渐层，毛色高级，性格温顺',
    emoji: '😸',
    bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
    merchant: '贵族猫舍',
    rating: 4.9,
    distance: 3.0,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '8',
    name: '哈士奇',
    breed: '西伯利亚雪橇犬',
    type: 'dog',
    price: 3200,
    age: '2个月',
    gender: '弟弟',
    features: ['帅气', '活泼', '蓝眼'],
    description: '蓝眼哈士奇，帅气二哈，精力充沛',
    emoji: '🐺',
    bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
    merchant: '雪橇犬基地',
    rating: 4.5,
    distance: 6.2,
    vaccinated: true,
    dewormed: false
  },
  {
    id: '9',
    name: '暹罗猫',
    breed: '暹罗猫',
    type: 'cat',
    price: 3200,
    age: '4个月',
    gender: '妹妹',
    features: ['重点色', '聪明', '话痨'],
    description: '重点色暹罗，聪明伶俐，喜欢交流',
    emoji: '🐱',
    bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
    merchant: '东方猫舍',
    rating: 4.7,
    distance: 2.8,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '10',
    name: '泰迪贵宾',
    breed: '泰迪',
    type: 'dog',
    price: 2500,
    originalPrice: 3000,
    age: '2个月',
    gender: '妹妹',
    features: ['卷毛', '聪明', '不掉毛'],
    description: '玩具泰迪，棕色卷毛，聪明可爱不掉毛',
    emoji: '🐩',
    bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
    merchant: '萌宠天地',
    rating: 4.6,
    distance: 1.5,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '11',
    name: '橘猫胖胖',
    breed: '中华田园猫',
    type: 'cat',
    price: 800,
    age: '3个月',
    gender: '弟弟',
    features: ['胖橘', '贪吃', '温顺'],
    description: '大橘为重，能吃不挑食，身体强壮',
    emoji: '🐱',
    bgColor: 'bg-gradient-to-br from-orange-100 to-orange-200',
    merchant: '爱心救助站',
    rating: 4.9,
    distance: 1.2,
    vaccinated: true,
    dewormed: true
  },
  {
    id: '12',
    name: '拉布拉多',
    breed: '拉布拉多寻回犬',
    type: 'dog',
    price: 3800,
    age: '3个月',
    gender: '弟弟',
    features: ['温顺', '聪明', '导盲犬'],
    description: '拉布拉多，性格超级温顺，聪明易训练',
    emoji: '🦮',
    bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
    merchant: '工作犬基地',
    rating: 4.8,
    distance: 4.5,
    vaccinated: true,
    dewormed: true
  }
]

export default function PetGalleryPage() {
  const [pets] = useState<Pet[]>(mockPets)
  const [filterType, setFilterType] = useState<'all' | 'cat' | 'dog'>('all')

  // 过滤宠物
  const filteredPets = filterType === 'all' 
    ? pets 
    : pets.filter(pet => pet.type === filterType)

  // 瀑布流布局：计算左右两列
  const leftColumn: Pet[] = []
  const rightColumn: Pet[] = []
  
  filteredPets.forEach((pet, index) => {
    if (index % 2 === 0) {
      leftColumn.push(pet)
    } else {
      rightColumn.push(pet)
    }
  })

  const handlePetClick = (petId: string) => {
    Taro.navigateTo({ url: `/pages/pet-shop-detail/index?petId=${petId}` })
  }

  const renderPetCard = (pet: Pet) => {
    const imageHeight = Math.floor(Math.random() * 80) + 180 // 随机高度
    
    return (
      <Card 
        key={pet.id} 
        className="bg-white shadow-sm mb-3 overflow-hidden"
        onClick={() => handlePetClick(pet.id)}
      >
        <View className="relative">
          {/* 使用渐变背景 + emoji 代替图片 */}
          <View 
            className={`w-full ${pet.bgColor} flex items-center justify-center`}
            style={{ height: `${imageHeight}px` }}
          >
            <Text className="text-7xl">{pet.emoji}</Text>
          </View>
          
          {/* 标签 */}
          <View className="absolute top-2 left-2 flex flex-wrap gap-1">
            {pet.originalPrice && (
              <Badge className="bg-red-500 text-white text-xs">特价</Badge>
            )}
            {pet.vaccinated && (
              <Badge className="bg-green-500 text-white text-xs">已疫苗</Badge>
            )}
          </View>
          
          {/* 价格标签 */}
          <View 
            className="absolute bottom-0 left-0 right-0 p-3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
          >
            <View className="flex items-baseline gap-2">
              <Text className="text-white text-lg font-bold">
                ¥{pet.price.toLocaleString()}
              </Text>
              {pet.originalPrice && (
                <Text className="text-gray-300 text-xs line-through">
                  ¥{pet.originalPrice.toLocaleString()}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        <CardContent className="p-3">
          <View className="flex items-center gap-2 mb-1">
            <Text className="text-sm font-medium text-gray-800">
              {pet.name}
            </Text>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                pet.type === 'cat' 
                  ? 'border-pink-300 text-pink-600' 
                  : 'border-blue-300 text-blue-600'
              }`}
            >
              {pet.type === 'cat' ? '猫咪' : pet.type === 'dog' ? '狗狗' : '其他'}
            </Badge>
          </View>
          
          <Text className="block text-xs text-gray-500 mb-2">
            {pet.breed} · {pet.age} · {pet.gender}
          </Text>
          
          <Text className="block text-xs text-gray-600 mb-2 line-clamp-2">
            {pet.description}
          </Text>
          
          <View className="flex flex-wrap gap-1 mb-2">
            {pet.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </View>
          
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-1">
              <Text className="text-xs text-orange-500">⭐</Text>
              <Text className="text-xs text-gray-600">{pet.rating}</Text>
              <Text className="text-xs text-gray-400">·</Text>
              <Text className="text-xs text-gray-500">{pet.merchant}</Text>
            </View>
            <Text className="text-xs text-gray-400">{pet.distance}km</Text>
          </View>
        </CardContent>
      </Card>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Text className="block text-lg font-semibold text-gray-800 text-center">
          宠物广场
        </Text>
      </View>

      {/* 筛选栏 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex items-center justify-center gap-4">
          <Text 
            className={`text-sm ${filterType === 'all' ? 'text-orange-500 font-medium' : 'text-gray-600'}`}
            onClick={() => setFilterType('all')}
          >
            全部
          </Text>
          <Text 
            className={`text-sm ${filterType === 'cat' ? 'text-orange-500 font-medium' : 'text-gray-600'}`}
            onClick={() => setFilterType('cat')}
          >
            🐱 猫咪
          </Text>
          <Text 
            className={`text-sm ${filterType === 'dog' ? 'text-orange-500 font-medium' : 'text-gray-600'}`}
            onClick={() => setFilterType('dog')}
          >
            🐕 狗狗
          </Text>
        </View>
      </View>

      {/* 瀑布流列表 */}
      <ScrollView 
        scrollY 
        className="pet-gallery-scroll"
        style={{ height: 'calc(100vh - 100px)' }}
      >
        {filteredPets.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="text-4xl mb-3">🐾</Text>
            <Text className="text-gray-400">暂无宠物</Text>
          </View>
        ) : (
          <View className="flex gap-3 px-3 py-3">
            {/* 左列 */}
            <View className="flex-1">
              {leftColumn.map(pet => renderPetCard(pet))}
            </View>
            {/* 右列 */}
            <View className="flex-1">
              {rightColumn.map(pet => renderPetCard(pet))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

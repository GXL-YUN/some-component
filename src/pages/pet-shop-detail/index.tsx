import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, MapPin, Phone, Shield } from 'lucide-react-taro'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.css'

interface PetShop {
  id: string
  name: string
  type: string
  breed: string
  price: number
  age?: string
  gender?: string
  color?: string
  features: string[]
  avatar: string
  description?: string
  health_guarantee?: string
  store_name?: string
  store_address?: string
  store_phone?: string
  photos?: string[]
}

export default function PetShopDetailPage() {
  const router = useRouter()
  const petId = router.params.petId

  const [pet, setPet] = useState<PetShop | null>(null)
  const [loading, setLoading] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (petId) {
      loadPetDetail()
    }
  }, [petId])

  const loadPetDetail = async () => {
    setLoading(true)
    try {
      // 这里可以调用后端API获取宠物商品详情
      // 目前使用模拟数据
      const mockPet: PetShop = {
        id: petId || '1',
        name: '英短蓝猫',
        type: 'cat',
        breed: '英国短毛猫',
        price: 3500,
        age: '3个月',
        gender: '公',
        color: '蓝色',
        features: ['温顺', '易养', '粘人', '圆脸'],
        avatar: '🐱',
        description: '纯种英短蓝猫，健康活泼，已完成第一针疫苗，附赠健康证明和喂养指南。性格温顺，非常适合家庭饲养。',
        health_guarantee: '7天健康保障，如有健康问题可退款或更换',
        store_name: '宠爱之家',
        store_address: '北京市朝阳区宠物街123号',
        store_phone: '400-123-4567',
        photos: []
      }
      setPet(mockPet)
    } catch (error) {
      console.error('加载宠物详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    Taro.showToast({
      title: isFavorited ? '已取消收藏' : '已收藏',
      icon: 'success'
    })
  }

  const handleBuy = () => {
    // 跳转到订单创建页面或直接创建订单
    Taro.showModal({
      title: '确认购买',
      content: `确定要购买 ${pet?.name} 吗？价格为 ¥${pet?.price}`,
      success: (res) => {
        if (res.confirm) {
          // 创建订单逻辑
          Taro.showToast({
            title: '购买成功',
            icon: 'success'
          })
          setTimeout(() => {
            Taro.navigateTo({ url: '/pages/order-list/index' })
          }, 1500)
        }
      }
    })
  }

  const handleCallStore = () => {
    if (pet?.store_phone) {
      Taro.makePhoneCall({
        phoneNumber: pet.store_phone
      })
    }
  }

  const handleNavigateToStore = () => {
    // 跳转到门店详情（如果有的话）
    Taro.showToast({
      title: '门店详情功能开发中',
      icon: 'none'
    })
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-sm text-gray-500">加载中...</Text>
      </View>
    )
  }

  if (!pet) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-sm text-gray-500">宠物信息不存在</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      <ScrollView scrollY style={{ height: 'calc(100vh - 80px)' }}>
        {/* 顶部图片区域 */}
        <View className="bg-gradient-to-br from-orange-100 to-teal-100 h-80 flex items-center justify-center">
          {pet.photos && pet.photos.length > 0 ? (
            <Text className="text-xs text-gray-400">宠物照片</Text>
          ) : (
            <Text className="text-8xl">{pet.avatar}</Text>
          )}
        </View>

        {/* 基本信息 */}
        <View className="bg-white px-4 py-4 border-b border-gray-100">
          <View className="flex items-start justify-between mb-3">
            <View className="flex-1">
              <View className="flex items-center gap-2 mb-2">
                <Text className="text-2xl font-bold text-gray-800">{pet.name}</Text>
                {pet.gender && (
                  <Text className={`text-lg ${pet.gender === '公' ? 'text-blue-500' : 'text-pink-500'}`}>
                    {pet.gender === '公' ? '♂' : '♀'}
                  </Text>
                )}
              </View>
              <View className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-orange-300 text-orange-600">
                  {pet.type === 'cat' ? '猫咪' : '狗狗'}
                </Badge>
                <Text className="text-sm text-gray-500">{pet.breed}</Text>
                {pet.color && (
                  <>
                    <Text className="text-gray-300">·</Text>
                    <Text className="text-sm text-gray-500">{pet.color}</Text>
                  </>
                )}
              </View>
            </View>
            <View onClick={handleFavorite}>
              <Heart 
                size={28} 
                color={isFavorited ? '#ff6b35' : '#d1d5db'}
                filled={isFavorited}
              />
            </View>
          </View>

          <View className="flex items-baseline gap-1">
            <Text className="text-3xl font-bold text-orange-500">¥{pet.price}</Text>
            <Text className="text-sm text-gray-400 line-through">
              ¥{Math.round(pet.price * 1.2)}
            </Text>
          </View>

          {pet.age && (
            <View className="mt-3">
              <Text className="text-sm text-gray-500">年龄: {pet.age}</Text>
            </View>
          )}
        </View>

        {/* 特点标签 */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-base font-medium text-gray-800 mb-3">特点</Text>
          <View className="flex flex-wrap gap-2">
            {pet.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {feature}
              </Badge>
            ))}
          </View>
        </View>

        {/* 健康保障 */}
        {pet.health_guarantee && (
          <Card className="bg-white mx-4 mb-2 shadow-sm">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-2">
                <Shield size={20} color="#14b8a6" />
                <Text className="text-base font-medium text-gray-800">健康保障</Text>
              </View>
              <Text className="text-sm text-gray-600">{pet.health_guarantee}</Text>
            </CardContent>
          </Card>
        )}

        {/* 详细描述 */}
        {pet.description && (
          <Card className="bg-white mx-4 mb-2 shadow-sm">
            <CardContent className="p-4">
              <Text className="text-base font-medium text-gray-800 mb-2">详细描述</Text>
              <Text className="text-sm text-gray-600 leading-relaxed">{pet.description}</Text>
            </CardContent>
          </Card>
        )}

        {/* 门店信息 */}
        {pet.store_name && (
          <Card className="bg-white mx-4 mb-4 shadow-sm" onClick={handleNavigateToStore}>
            <CardContent className="p-4">
              <Text className="text-base font-medium text-gray-800 mb-3">门店信息</Text>
              <View className="space-y-2">
                <View className="flex items-center gap-2">
                  <Text className="text-sm font-medium text-gray-700">{pet.store_name}</Text>
                </View>
                {pet.store_address && (
                  <View className="flex items-start gap-2">
                    <MapPin size={16} color="#9ca3af" />
                    <Text className="text-sm text-gray-500 flex-1">{pet.store_address}</Text>
                  </View>
                )}
                {pet.store_phone && (
                  <View className="flex items-center gap-2" onClick={handleCallStore}>
                    <Phone size={16} color="#9ca3af" />
                    <Text className="text-sm text-orange-500">{pet.store_phone}</Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        )}
      </ScrollView>

      {/* 底部操作栏 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 items-center">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCallStore}
        >
          <Phone size={18} color="#ff6b35" className="mr-1" />
          联系商家
        </Button>
        <Button
          className="flex-1 bg-orange-500"
          onClick={handleBuy}
        >
          <ShoppingCart size={18} color="#ffffff" className="mr-1" />
          立即购买
        </Button>
      </View>
    </View>
  )
}

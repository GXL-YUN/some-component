import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react-taro'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

interface Pet {
  id: string
  name: string
  pet_type: string
  breed: string
  gender: string
  birthday?: string
  photo_url?: string
  color?: string
  weight?: number
  sterilized?: boolean
  chip_number?: string
  personality?: string
  vaccine_records?: any
  deworming_records?: any
  description?: string
  created_at: string
}

export default function PetListPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)
  const testUserId = 'test-user-001'

  // 每次页面显示时刷新列表
  useDidShow(() => {
    loadPets()
  })

  const loadPets = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/pets',
        method: 'GET',
        data: { user_id: testUserId }
      })

      if (res.data?.data) {
        setPets(res.data.data)
      } else if (Array.isArray(res.data)) {
        setPets(res.data)
      }
    } catch (error) {
      console.error('加载宠物列表失败:', error)
      // 使用模拟数据
      setPets([
        {
          id: '1',
          name: '小橘',
          pet_type: 'cat',
          breed: '橘猫',
          gender: 'male',
          birthday: '2023-06-15',
          photo_url: '',
          color: '橘色',
          weight: 4.5,
          sterilized: true,
          chip_number: 'CN20231015001',
          personality: '活泼好动，喜欢玩逗猫棒',
          vaccine_records: [
            { date: '2023-08-15', name: '猫三联第一针' },
            { date: '2023-09-15', name: '猫三联第二针' }
          ],
          deworming_records: [
            { date: '2023-10-01', type: '体内驱虫' }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: '豆豆',
          pet_type: 'dog',
          breed: '柯基',
          gender: 'female',
          birthday: '2023-03-20',
          photo_url: '',
          color: '黄白相间',
          weight: 12.8,
          sterilized: false,
          chip_number: 'CN20231015002',
          personality: '温顺可爱，喜欢散步',
          vaccine_records: [
            { date: '2023-05-20', name: '犬五联第一针' },
            { date: '2023-06-20', name: '犬五联第二针' },
            { date: '2023-07-20', name: '狂犬疫苗' }
          ],
          deworming_records: [
            { date: '2023-09-15', type: '体内外驱虫' }
          ],
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePetClick = (petId: string) => {
    Taro.navigateTo({ url: `/pages/pet-detail/index?petId=${petId}` })
  }

  const handleAddPet = () => {
    Taro.navigateTo({ url: '/pages/pet-detail/index?mode=add' })
  }

  const calculateAge = (birthday?: string) => {
    if (!birthday) return '未知'
    
    const birth = new Date(birthday)
    const now = new Date()
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
    
    if (months < 1) return '不到1个月'
    if (months < 12) return `${months}个月`
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return remainingMonths > 0 ? `${years}岁${remainingMonths}个月` : `${years}岁`
  }

  const getPetEmoji = (petType: string) => {
    return petType === 'cat' ? '🐱' : '🐶'
  }

  const getGenderText = (gender: string) => {
    return gender === 'male' ? '♂' : '♀'
  }

  const getGenderColor = (gender: string) => {
    return gender === 'male' ? 'text-blue-500' : 'text-pink-500'
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex items-center justify-between">
          <Text className="text-lg font-semibold text-gray-800">我的宠物</Text>
          <Button size="sm" onClick={handleAddPet}>
            <Plus size={16} color="#ff6b35" className="mr-1" />
            添加宠物
          </Button>
        </View>
      </View>

      {/* 宠物列表 */}
      <ScrollView className="px-4 py-4" scrollY style={{ height: 'calc(100vh - 120px)' }}>
        {loading ? (
          <View className="flex items-center justify-center py-20">
            <Text className="text-sm text-gray-400">加载中...</Text>
          </View>
        ) : pets.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="text-4xl mb-4">🐾</Text>
            <Text className="text-sm text-gray-400 mb-4">还没有添加宠物</Text>
            <Button onClick={handleAddPet}>
              <Plus size={16} color="#ff6b35" className="mr-1" />
              添加我的第一只宠物
            </Button>
          </View>
        ) : (
          <View className="space-y-3">
            {pets.map((pet) => (
              <Card
                key={pet.id}
                className="bg-white shadow-sm overflow-hidden"
                onClick={() => handlePetClick(pet.id)}
              >
                <CardContent className="p-4">
                  {/* 基本信息 */}
                  <View className="flex gap-3 mb-3">
                    {/* 宠物头像 */}
                    <View className="w-20 h-20 bg-gradient-to-br from-orange-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {pet.photo_url ? (
                        <Text className="text-xs text-gray-400">照片</Text>
                      ) : (
                        <Text className="text-4xl">{getPetEmoji(pet.pet_type)}</Text>
                      )}
                    </View>

                    {/* 宠物信息 */}
                    <View className="flex-1">
                      <View className="flex items-center gap-2 mb-1">
                        <Text className="text-lg font-semibold text-gray-800">
                          {pet.name}
                        </Text>
                        <Text className={`text-lg ${getGenderColor(pet.gender)}`}>
                          {getGenderText(pet.gender)}
                        </Text>
                        {pet.sterilized && (
                          <Badge variant="secondary" className="text-xs">
                            已绝育
                          </Badge>
                        )}
                      </View>
                      
                      <View className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            pet.pet_type === 'cat'
                              ? 'border-pink-300 text-pink-600'
                              : 'border-blue-300 text-blue-600'
                          }`}
                        >
                          {pet.pet_type === 'cat' ? '猫咪' : '狗狗'}
                        </Badge>
                        <Text className="text-sm text-gray-500">{pet.breed}</Text>
                        {pet.color && (
                          <>
                            <Text className="text-gray-300">·</Text>
                            <Text className="text-sm text-gray-500">{pet.color}</Text>
                          </>
                        )}
                      </View>

                      <View className="flex items-center gap-3 text-xs text-gray-500">
                        <Text>{calculateAge(pet.birthday)}</Text>
                        {pet.weight && (
                          <>
                            <Text className="text-gray-300">|</Text>
                            <Text>{pet.weight}kg</Text>
                          </>
                        )}
                      </View>
                    </View>

                    {/* 箭头 */}
                    <View className="flex items-center">
                      <Text className="text-gray-400">{'>'}</Text>
                    </View>
                  </View>

                  {/* 详细信息 */}
                  <View className="pt-3 border-t border-gray-100">
                    <View className="grid grid-cols-2 gap-2 text-xs">
                      <View className="flex items-center gap-1">
                        <Text className="text-gray-400">疫苗:</Text>
                        <Text className="text-gray-600">
                          {pet.vaccine_records && Array.isArray(pet.vaccine_records) 
                            ? `已接种${pet.vaccine_records.length}针` 
                            : '暂无记录'}
                        </Text>
                      </View>
                      <View className="flex items-center gap-1">
                        <Text className="text-gray-400">驱虫:</Text>
                        <Text className="text-gray-600">
                          {pet.deworming_records && Array.isArray(pet.deworming_records)
                            ? `${pet.deworming_records.length}次`
                            : '暂无记录'}
                        </Text>
                      </View>
                      {pet.chip_number && (
                        <View className="flex items-center gap-1 col-span-2">
                          <Text className="text-gray-400">芯片:</Text>
                          <Text className="text-gray-600">{pet.chip_number}</Text>
                        </View>
                      )}
                    </View>
                    {pet.personality && (
                      <View className="mt-2">
                        <Text className="text-xs text-gray-400">性格:</Text>
                        <Text className="text-xs text-gray-600 ml-1">{pet.personality}</Text>
                      </View>
                    )}
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

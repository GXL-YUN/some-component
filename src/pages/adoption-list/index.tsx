import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.css'

interface AdoptionPet {
  id: string
  name: string
  type: 'cat' | 'dog'
  breed: string
  age: string
  gender: '公' | '母'
  status: 'available' | 'reserved' | 'adopted'
  requirements: string[]
  description: string
  avatar: string
  color: string
  imageHeight: number // 瀑布流图片高度
  vaccinated: boolean
  neutered: boolean
  location: string
  publisher: string
  publishTime: string
}

export default function AdoptionListPage() {
  const [pets, setPets] = useState<AdoptionPet[]>([])
  const [filterType, setFilterType] = useState<'all' | 'cat' | 'dog'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available'>('available')

  useEffect(() => {
    loadAdoptionPets()
  }, [filterType, filterStatus])

  const loadAdoptionPets = async () => {
    // 模拟数据
    const mockPets: AdoptionPet[] = [
      {
        id: 'adopt-001',
        name: '小橘',
        type: 'cat',
        breed: '橘猫',
        age: '1岁',
        gender: '公',
        status: 'available',
        requirements: ['有养宠经验', '定期回访'],
        description: '性格温顺，已绝育驱虫，特别亲人，喜欢被抚摸',
        avatar: '🐱',
        color: 'bg-orange-100',
        imageHeight: 180,
        vaccinated: true,
        neutered: true,
        location: '北京市朝阳区',
        publisher: '爱心救助站',
        publishTime: '2天前'
      },
      {
        id: 'adopt-002',
        name: '旺财',
        type: 'dog',
        breed: '中华田园犬',
        age: '2岁',
        gender: '公',
        status: 'available',
        requirements: ['有院子', '定期疫苗'],
        description: '聪明听话，已打疫苗，看家护院好帮手，忠诚可靠',
        avatar: '🐕',
        color: 'bg-yellow-100',
        imageHeight: 160,
        vaccinated: true,
        neutered: false,
        location: '北京市海淀区',
        publisher: '个人救助',
        publishTime: '3天前'
      },
      {
        id: 'adopt-003',
        name: '雪球',
        type: 'cat',
        breed: '英短蓝白',
        age: '8个月',
        gender: '母',
        status: 'reserved',
        requirements: ['有养猫经验', '不离不弃'],
        description: '颜值超高，性格安静，适合公寓饲养',
        avatar: '🐱',
        color: 'bg-blue-100',
        imageHeight: 200,
        vaccinated: true,
        neutered: false,
        location: '北京市西城区',
        publisher: '猫咪救助中心',
        publishTime: '1天前'
      },
      {
        id: 'adopt-004',
        name: '豆豆',
        type: 'dog',
        breed: '泰迪',
        age: '3岁',
        gender: '公',
        status: 'available',
        requirements: ['有耐心', '每天遛狗'],
        description: '活泼可爱，已绝育，适合有孩子的家庭，非常粘人',
        avatar: '🐕',
        color: 'bg-pink-100',
        imageHeight: 140,
        vaccinated: true,
        neutered: true,
        location: '北京市东城区',
        publisher: '爱心家庭',
        publishTime: '5天前'
      },
      {
        id: 'adopt-005',
        name: '花花',
        type: 'cat',
        breed: '三花猫',
        age: '1.5岁',
        gender: '母',
        status: 'available',
        requirements: ['室内饲养', '定期驱虫'],
        description: '独立自主，不挑食，适合上班族，会自己玩',
        avatar: '🐱',
        color: 'bg-purple-100',
        imageHeight: 170,
        vaccinated: true,
        neutered: true,
        location: '北京市丰台区',
        publisher: '流浪猫救助',
        publishTime: '4天前'
      },
      {
        id: 'adopt-006',
        name: '大黑',
        type: 'dog',
        breed: '拉布拉多',
        age: '4岁',
        gender: '公',
        status: 'available',
        requirements: ['大空间', '每天运动'],
        description: '温顺友善，非常适合有小孩的家庭，喜欢游泳',
        avatar: '🐕',
        color: 'bg-gray-100',
        imageHeight: 190,
        vaccinated: true,
        neutered: true,
        location: '北京市通州区',
        publisher: '宠物救助站',
        publishTime: '1周前'
      },
      {
        id: 'adopt-007',
        name: '咪咪',
        type: 'cat',
        breed: '美短虎斑',
        age: '2岁',
        gender: '母',
        status: 'available',
        requirements: ['定期体检', '科学喂养'],
        description: '活泼好动，喜欢玩耍，已绝育，身体健康',
        avatar: '🐱',
        color: 'bg-green-100',
        imageHeight: 150,
        vaccinated: true,
        neutered: true,
        location: '北京市昌平区',
        publisher: '爱心人士',
        publishTime: '2天前'
      },
      {
        id: 'adopt-008',
        name: '小白',
        type: 'dog',
        breed: '萨摩耶',
        age: '1岁',
        gender: '公',
        status: 'available',
        requirements: ['每天梳毛', '有空调环境'],
        description: '微笑天使，性格温顺，毛发洁白，需要定期美容',
        avatar: '🐕',
        color: 'bg-white border border-gray-200',
        imageHeight: 210,
        vaccinated: true,
        neutered: false,
        location: '北京市大兴区',
        publisher: '萨摩耶救助',
        publishTime: '3天前'
      },
      {
        id: 'adopt-009',
        name: '虎子',
        type: 'cat',
        breed: '狸花猫',
        age: '6个月',
        gender: '公',
        status: 'available',
        requirements: ['室内饲养', '有耐心'],
        description: '活泼可爱，好奇心强，喜欢探索，适合年轻家庭',
        avatar: '🐱',
        color: 'bg-amber-100',
        imageHeight: 160,
        vaccinated: true,
        neutered: false,
        location: '北京市石景山区',
        publisher: '社区救助',
        publishTime: '1天前'
      },
      {
        id: 'adopt-010',
        name: '毛毛',
        type: 'dog',
        breed: '金毛',
        age: '5岁',
        gender: '公',
        status: 'available',
        requirements: ['有院子优先', '每天遛狗'],
        description: '性格温和，特别聪明，对小孩友善，已完成基础训练',
        avatar: '🐕',
        color: 'bg-yellow-50',
        imageHeight: 185,
        vaccinated: true,
        neutered: true,
        location: '北京市顺义区',
        publisher: '金毛救助站',
        publishTime: '6天前'
      },
      {
        id: 'adopt-011',
        name: '点点',
        type: 'cat',
        breed: '奶牛猫',
        age: '1岁',
        gender: '公',
        status: 'available',
        requirements: ['不离不弃', '定期疫苗'],
        description: '黑白相间，活泼可爱，喜欢追逐游戏，身体健康',
        avatar: '🐱',
        color: 'bg-slate-100',
        imageHeight: 175,
        vaccinated: true,
        neutered: true,
        location: '北京市房山区',
        publisher: '爱心家庭',
        publishTime: '4天前'
      },
      {
        id: 'adopt-012',
        name: '小黄',
        type: 'dog',
        breed: '柯基',
        age: '2岁',
        gender: '公',
        status: 'reserved',
        requirements: ['控制体重', '定期体检'],
        description: '小短腿，大屁股，可爱爆表，已绝育，需要控制饮食',
        avatar: '🐕',
        color: 'bg-orange-50',
        imageHeight: 145,
        vaccinated: true,
        neutered: true,
        location: '北京市朝阳区',
        publisher: '柯基俱乐部',
        publishTime: '2天前'
      }
    ]

    // 筛选
    let filtered = mockPets
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType)
    }
    if (filterStatus === 'available') {
      filtered = filtered.filter(p => p.status === 'available')
    }

    setPets(filtered)
  }

  // 瀑布流分组
  const getWaterfallColumns = () => {
    const left: AdoptionPet[] = []
    const right: AdoptionPet[] = []
    let leftHeight = 0
    let rightHeight = 0

    pets.forEach(pet => {
      if (leftHeight <= rightHeight) {
        left.push(pet)
        leftHeight += pet.imageHeight
      } else {
        right.push(pet)
        rightHeight += pet.imageHeight
      }
    })

    return { left, right }
  }

  const { left, right } = getWaterfallColumns()

  const handlePetClick = (petId: string) => {
    Taro.navigateTo({ url: `/pages/adoption-detail/index?id=${petId}` })
  }

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/adoption-publish/index' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 text-white text-xs">可领养</Badge>
      case 'reserved':
        return <Badge className="bg-blue-500 text-white text-xs">已预约</Badge>
      case 'adopted':
        return <Badge className="bg-gray-400 text-white text-xs">已领养</Badge>
      default:
        return null
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部筛选栏 */}
      <View className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        {/* 左侧标题 */}
        <Text className="text-base font-semibold text-gray-800">领养广场</Text>

        {/* 右侧操作 */}
        <View className="flex items-center gap-3">
          {/* 类型筛选 */}
          <View className="flex items-center gap-1">
            <View
              className={`px-2 py-1 rounded text-xs ${filterType === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setFilterType('all')}
            >
              <Text>全部</Text>
            </View>
            <View
              className={`px-2 py-1 rounded text-xs ${filterType === 'cat' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setFilterType('cat')}
            >
              <Text>🐱</Text>
            </View>
            <View
              className={`px-2 py-1 rounded text-xs ${filterType === 'dog' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setFilterType('dog')}
            >
              <Text>🐕</Text>
            </View>
          </View>

          {/* 状态筛选 */}
          <View
            className={`px-2 py-1 rounded text-xs ${filterStatus === 'available' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilterStatus(filterStatus === 'available' ? 'all' : 'available')}
          >
            <Text>{filterStatus === 'available' ? '可领养' : '全部'}</Text>
          </View>

          {/* 我发布的 */}
          <View
            className="flex items-center gap-1 px-2 py-1 rounded bg-orange-50"
            onClick={() => Taro.navigateTo({ url: '/pages/my-adoptions/index' })}
          >
            <Text className="text-sm">✏️</Text>
            <Text className="text-xs text-orange-600">我发布的</Text>
          </View>
        </View>
      </View>

      {/* 瀑布流列表 */}
      <ScrollView className="adoption-waterfall" scrollY>
        <View className="flex flex-row gap-2 p-2">
          {/* 左列 */}
          <View className="flex-1 flex flex-col gap-2">
            {left.map((pet) => (
              <Card 
                key={pet.id} 
                className="bg-white overflow-hidden"
                onClick={() => handlePetClick(pet.id)}
              >
                <View 
                  className={`${pet.color} flex items-center justify-center`}
                  style={{ height: `${pet.imageHeight}px` }}
                >
                  <Text className="text-6xl">{pet.avatar}</Text>
                </View>
                <CardContent className="p-3">
                  <View className="flex items-center justify-between mb-2">
                    <Text className="text-base font-semibold text-gray-800">{pet.name}</Text>
                    {getStatusBadge(pet.status)}
                  </View>
                  <View className="flex items-center gap-2 mb-2">
                    <Text className="text-xs text-gray-500">{pet.breed}</Text>
                    <Text className="text-xs text-gray-400">·</Text>
                    <Text className="text-xs text-gray-500">{pet.gender}</Text>
                    <Text className="text-xs text-gray-400">·</Text>
                    <Text className="text-xs text-gray-500">{pet.age}</Text>
                  </View>
                  <Text className="text-xs text-gray-600 line-clamp-2 mb-2">{pet.description}</Text>
                  <View className="flex items-center gap-1 mb-2">
                    {pet.vaccinated && (
                      <Badge className="bg-green-50 text-green-600 text-xs">已疫苗</Badge>
                    )}
                    {pet.neutered && (
                      <Badge className="bg-blue-50 text-blue-600 text-xs">已绝育</Badge>
                    )}
                  </View>
                  <View className="flex items-center justify-between text-xs text-gray-400">
                    <Text>{pet.location}</Text>
                    <Text>{pet.publishTime}</Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>

          {/* 右列 */}
          <View className="flex-1 flex flex-col gap-2">
            {right.map((pet) => (
              <Card 
                key={pet.id} 
                className="bg-white overflow-hidden"
                onClick={() => handlePetClick(pet.id)}
              >
                <View 
                  className={`${pet.color} flex items-center justify-center`}
                  style={{ height: `${pet.imageHeight}px` }}
                >
                  <Text className="text-6xl">{pet.avatar}</Text>
                </View>
                <CardContent className="p-3">
                  <View className="flex items-center justify-between mb-2">
                    <Text className="text-base font-semibold text-gray-800">{pet.name}</Text>
                    {getStatusBadge(pet.status)}
                  </View>
                  <View className="flex items-center gap-2 mb-2">
                    <Text className="text-xs text-gray-500">{pet.breed}</Text>
                    <Text className="text-xs text-gray-400">·</Text>
                    <Text className="text-xs text-gray-500">{pet.gender}</Text>
                    <Text className="text-xs text-gray-400">·</Text>
                    <Text className="text-xs text-gray-500">{pet.age}</Text>
                  </View>
                  <Text className="text-xs text-gray-600 line-clamp-2 mb-2">{pet.description}</Text>
                  <View className="flex items-center gap-1 mb-2">
                    {pet.vaccinated && (
                      <Badge className="bg-green-50 text-green-600 text-xs">已疫苗</Badge>
                    )}
                    {pet.neutered && (
                      <Badge className="bg-blue-50 text-blue-600 text-xs">已绝育</Badge>
                    )}
                  </View>
                  <View className="flex items-center justify-between text-xs text-gray-400">
                    <Text>{pet.location}</Text>
                    <Text>{pet.publishTime}</Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>

        {/* 底部提示 */}
        <View className="py-4 text-center">
          <Text className="text-xs text-gray-400">已加载全部领养信息</Text>
        </View>

        {/* 底部占位，避免被发布按钮遮挡 */}
        <View className="h-20" />
      </ScrollView>

      {/* 底部发布按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button 
          className="w-full bg-orange-500 text-white flex items-center justify-center gap-2"
          onClick={handlePublish}
        >
          <Text className="text-lg">✏️</Text>
          <Text className="text-base">发布领养信息</Text>
        </Button>
      </View>
    </View>
  )
}

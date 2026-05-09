import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Member {
  id: string
  user_id: string
  user_name: string
  user_phone: string
  user_avatar?: string
  pets: Array<{
    name: string
    type: string
    breed: string
  }>
  total_spent: number
  total_orders: number
  last_visit: string
  member_level: 'normal' | 'silver' | 'gold' | 'diamond'
}

interface OrderRecord {
  id: string
  service_name: string
  pet_name: string
  amount: number
  created_at: string
  status: string
}

const LEVEL_MAP: Record<string, { label: string; color: string; minSpent: number }> = {
  normal: { label: '普通会员', color: 'bg-gray-100 text-gray-600', minSpent: 0 },
  silver: { label: '白银会员', color: 'bg-gray-200 text-gray-700', minSpent: 500 },
  gold: { label: '黄金会员', color: 'bg-yellow-100 text-yellow-600', minSpent: 2000 },
  diamond: { label: '钻石会员', color: 'bg-purple-100 text-purple-600', minSpent: 5000 },
}

export default function GroomingMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [, setLoading] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [memberOrders, setMemberOrders] = useState<OrderRecord[]>([])
  const [sortBy, setSortBy] = useState<'frequency' | 'amount'>('frequency')

  useEffect(() => {
    loadMembers()
  }, [sortBy])

  const loadMembers = async () => {
    setLoading(true)
    // 模拟数据 - 直接设置
    const mockMembers: Member[] = [
      {
        id: 'm1',
        user_id: 'u1',
        user_name: '张先生',
        user_phone: '138****1234',
        pets: [{ name: '小白', type: 'dog', breed: '泰迪' }],
        total_spent: 5280,
        total_orders: 28,
        last_visit: new Date(Date.now() - 86400000).toISOString(),
        member_level: 'diamond',
      },
      {
        id: 'm2',
        user_id: 'u2',
        user_name: '李女士',
        user_phone: '139****5678',
        pets: [{ name: '咪咪', type: 'cat', breed: '英短' }, { name: '小橘', type: 'cat', breed: '橘猫' }],
        total_spent: 4620,
        total_orders: 22,
        last_visit: new Date(Date.now() - 172800000).toISOString(),
        member_level: 'diamond',
      },
      {
        id: 'm3',
        user_id: 'u3',
        user_name: '王先生',
        user_phone: '137****9012',
        pets: [{ name: '大黄', type: 'dog', breed: '金毛' }],
        total_spent: 3180,
        total_orders: 18,
        last_visit: new Date(Date.now() - 604800000).toISOString(),
        member_level: 'gold',
      },
      {
        id: 'm4',
        user_id: 'u4',
        user_name: '赵女士',
        user_phone: '136****3456',
        pets: [{ name: '球球', type: 'dog', breed: '比熊' }],
        total_spent: 2850,
        total_orders: 15,
        last_visit: new Date(Date.now() - 259200000).toISOString(),
        member_level: 'gold',
      },
      {
        id: 'm5',
        user_id: 'u5',
        user_name: '陈先生',
        user_phone: '135****7890',
        pets: [{ name: '豆豆', type: 'dog', breed: '泰迪' }],
        total_spent: 1560,
        total_orders: 12,
        last_visit: new Date(Date.now() - 432000000).toISOString(),
        member_level: 'silver',
      },
      {
        id: 'm6',
        user_id: 'u6',
        user_name: '周女士',
        user_phone: '134****2345',
        pets: [{ name: '毛毛', type: 'cat', breed: '布偶' }],
        total_spent: 1380,
        total_orders: 10,
        last_visit: new Date(Date.now() - 864000000).toISOString(),
        member_level: 'silver',
      },
      {
        id: 'm7',
        user_id: 'u7',
        user_name: '吴先生',
        user_phone: '133****6789',
        pets: [{ name: '旺财', type: 'dog', breed: '柴犬' }],
        total_spent: 960,
        total_orders: 8,
        last_visit: new Date(Date.now() - 1209600000).toISOString(),
        member_level: 'silver',
      },
      {
        id: 'm8',
        user_id: 'u8',
        user_name: '郑女士',
        user_phone: '132****0123',
        pets: [{ name: '小黑', type: 'dog', breed: '拉布拉多' }],
        total_spent: 640,
        total_orders: 6,
        last_visit: new Date(Date.now() - 1555200000).toISOString(),
        member_level: 'normal',
      },
      {
        id: 'm9',
        user_id: 'u9',
        user_name: '孙先生',
        user_phone: '131****4567',
        pets: [{ name: '花花', type: 'cat', breed: '美短' }],
        total_spent: 480,
        total_orders: 4,
        last_visit: new Date(Date.now() - 1900800000).toISOString(),
        member_level: 'normal',
      },
      {
        id: 'm10',
        user_id: 'u10',
        user_name: '钱女士',
        user_phone: '130****8901',
        pets: [{ name: '乐乐', type: 'dog', breed: '萨摩耶' }],
        total_spent: 320,
        total_orders: 3,
        last_visit: new Date(Date.now() - 2246400000).toISOString(),
        member_level: 'normal',
      },
      {
        id: 'm11',
        user_id: 'u11',
        user_name: '冯先生',
        user_phone: '129****1234',
        pets: [{ name: '豆包', type: 'dog', breed: '柯基' }],
        total_spent: 240,
        total_orders: 2,
        last_visit: new Date(Date.now() - 2592000000).toISOString(),
        member_level: 'normal',
      },
      {
        id: 'm12',
        user_id: 'u12',
        user_name: '韩女士',
        user_phone: '128****5678',
        pets: [{ name: '小美', type: 'cat', breed: '暹罗' }],
        total_spent: 160,
        total_orders: 1,
        last_visit: new Date(Date.now() - 2937600000).toISOString(),
        member_level: 'normal',
      },
    ]
    
    try {
      const info = Taro.getStorageSync('merchantInfo')
      const res = await Network.request({
        url: `/api/grooming/members`,
        method: 'GET',
        data: {
          merchant_id: info?.id,
          sort_by: sortBy,
        },
      })
      // 如果后端返回数据，使用后端数据；否则使用模拟数据
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setMembers(res.data.data)
      } else {
        setMembers(mockMembers)
      }
    } catch (error) {
      console.error('加载会员失败:', error)
      setMembers(mockMembers)
    } finally {
      setLoading(false)
    }
  }

  const loadMemberOrders = async (member: Member) => {
    try {
      const res = await Network.request({
        url: `/api/grooming/members/${member.user_id}/orders`,
        method: 'GET',
      })
      if (res.data?.data) {
        setMemberOrders(res.data.data)
      }
    } catch (error) {
      console.error('加载订单记录失败:', error)
      // 模拟数据
      setMemberOrders([
        {
          id: 'o1',
          service_name: '精洗护理',
          pet_name: member.pets[0]?.name || '宠物',
          amount: 120,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
        },
        {
          id: 'o2',
          service_name: '造型美容',
          pet_name: member.pets[0]?.name || '宠物',
          amount: 200,
          created_at: new Date(Date.now() - 604800000).toISOString(),
          status: 'completed',
        },
        {
          id: 'o3',
          service_name: '基础洗澡',
          pet_name: member.pets[0]?.name || '宠物',
          amount: 80,
          created_at: new Date(Date.now() - 1209600000).toISOString(),
          status: 'completed',
        },
      ])
    }
  }

  const handleViewMember = (member: Member) => {
    setSelectedMember(member)
    loadMemberOrders(member)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const getLevelInfo = (level: string) => {
    return LEVEL_MAP[level] || LEVEL_MAP.normal
  }

  if (selectedMember) {
    return (
      <ScrollView className="min-h-screen bg-gray-50" scrollY>
        <View className="p-4">
          <View className="flex items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-800">会员详情</Text>
            <Text className="text-orange-500 text-sm" onClick={() => setSelectedMember(null)}>
              返回
            </Text>
          </View>

          {/* 会员信息卡片 */}
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <View className="flex items-center gap-3 mb-4">
                <View className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
                  <Text className="text-2xl">👤</Text>
                </View>
                <View className="flex-1">
                  <View className="flex items-center gap-2">
                    <Text className="text-base font-medium text-gray-800">
                      {selectedMember.user_name}
                    </Text>
                    <Badge className={getLevelInfo(selectedMember.member_level).color}>
                      {getLevelInfo(selectedMember.member_level).label}
                    </Badge>
                  </View>
                  <Text className="text-sm text-gray-500 mt-1">
                    {selectedMember.user_phone}
                  </Text>
                </View>
              </View>

              <View className="flex gap-4 pt-3 border-t border-gray-100">
                <View className="flex-1 text-center">
                  <Text className="block text-xl font-bold text-orange-500">
                    ¥{selectedMember.total_spent}
                  </Text>
                  <Text className="block text-xs text-gray-500 mt-1">累计消费</Text>
                </View>
                <View className="flex-1 text-center border-l border-gray-100">
                  <Text className="block text-xl font-bold text-gray-800">
                    {selectedMember.total_orders}
                  </Text>
                  <Text className="block text-xs text-gray-500 mt-1">订单数</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 宠物信息 */}
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-3">宠物信息</Text>
              {selectedMember.pets.map((pet, index) => (
                <View key={index} className="flex items-center gap-3 py-2">
                  <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Text className="text-lg">{pet.type === 'dog' ? '🐕' : '🐱'}</Text>
                  </View>
                  <View>
                    <Text className="block text-sm font-medium text-gray-800">{pet.name}</Text>
                    <Text className="block text-xs text-gray-500">{pet.breed}</Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* 消费记录 */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-3">消费记录</Text>
              {memberOrders.map((order) => (
                <View
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <View>
                    <Text className="block text-sm font-medium text-gray-800">
                      {order.service_name}
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      {order.pet_name} · {formatDate(order.created_at)}
                    </Text>
                  </View>
                  <Text className="text-sm font-medium text-orange-500">
                    ¥{order.amount}
                  </Text>
                </View>
              ))}
              {memberOrders.length === 0 && (
                <View className="py-8 text-center">
                  <Text className="text-gray-400">暂无消费记录</Text>
                </View>
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 排序选择 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex gap-2">
          <View
            className={`flex-1 py-2 rounded-lg text-center ${
              sortBy === 'frequency' ? 'bg-orange-500' : 'bg-gray-100'
            }`}
            onClick={() => setSortBy('frequency')}
          >
            <Text className={sortBy === 'frequency' ? 'text-white' : 'text-gray-600'}>
              按消费频次
            </Text>
          </View>
          <View
            className={`flex-1 py-2 rounded-lg text-center ${
              sortBy === 'amount' ? 'bg-orange-500' : 'bg-gray-100'
            }`}
            onClick={() => setSortBy('amount')}
          >
            <Text className={sortBy === 'amount' ? 'text-white' : 'text-gray-600'}>
              按消费金额
            </Text>
          </View>
        </View>
      </View>

      {/* 会员列表 */}
      <ScrollView className="min-h-screen bg-gray-50" scrollY>
        <View className="p-4">
          {members.map((member, index) => (
            <Card
              key={member.id}
              className="bg-white shadow-sm mb-3"
              onClick={() => handleViewMember(member)}
            >
              <CardContent className="p-4">
                <View className="flex items-center gap-3">
                  <View className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                    <Text className="text-sm font-bold text-orange-500">{index + 1}</Text>
                  </View>
                  <View className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Text className="text-xl">👤</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex items-center gap-2">
                      <Text className="text-base font-medium text-gray-800">
                        {member.user_name}
                      </Text>
                      <Badge className={getLevelInfo(member.member_level).color}>
                        {getLevelInfo(member.member_level).label}
                      </Badge>
                    </View>
                    <Text className="text-xs text-gray-500 mt-1">
                      {member.pets.map(p => p.name).join('、')} · 最近 {formatDate(member.last_visit)}
                    </Text>
                  </View>
                  <View className="text-right">
                    <Text className="block text-base font-semibold text-orange-500">
                      ¥{member.total_spent}
                    </Text>
                    <Text className="block text-xs text-gray-400">
                      {member.total_orders}单
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}

          {members.length === 0 && (
            <View className="py-20 text-center">
              <Text className="text-4xl mb-4">👥</Text>
              <Text className="block text-gray-500">暂无会员</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

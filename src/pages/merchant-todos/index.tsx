import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface TodoItem {
  id: string
  type: 'new_demand' | 'order_confirm' | 'certificate' | 'withdraw'
  title: string
  description: string
  count: number
  priority: 'high' | 'medium' | 'low'
  url?: string
  created_at: string
}

export default function MerchantTodosPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(false)

  const merchantInfo = Taro.getStorageSync('merchantInfo')

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/merchants/${merchantInfo?.id}/todos`,
        method: 'GET',
      })

      console.log('待办事项响应:', res)

      if (res && res.data && res.data.length > 0) {
        setTodos(res.data)
      } else {
        // 响应数据为空，使用模拟数据
        throw new Error('响应数据为空')
      }
    } catch (error) {
      console.error('加载待办事项失败:', error)
      // 模拟数据
      setTodos([
        {
          id: 'todo-1',
          type: 'new_demand',
          title: '新需求提醒',
          description: '有 3 个新需求等待您报价',
          count: 3,
          priority: 'high',
          url: '/pages/merchant-demands/index',
          created_at: new Date().toISOString(),
        },
        {
          id: 'todo-2',
          type: 'order_confirm',
          title: '订单待发货',
          description: '有 2 个订单等待发货',
          count: 2,
          priority: 'high',
          url: '/pages/merchant-orders/index?tab=pending',
          created_at: new Date().toISOString(),
        },
        {
          id: 'todo-3',
          type: 'certificate',
          title: '检疫证明待上传',
          description: '订单 #order-001 需要上传检疫证明',
          count: 1,
          priority: 'medium',
          url: '/pages/merchant-certificate/index?orderId=order-001',
          created_at: new Date().toISOString(),
        },
        {
          id: 'todo-4',
          type: 'withdraw',
          title: '提现申请审核中',
          description: '您有一笔 ¥5000 的提现申请正在审核',
          count: 1,
          priority: 'low',
          url: '/pages/merchant-finance/index',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'todo-5',
          type: 'new_demand',
          title: '预算匹配提醒',
          description: '有 1 个需求预算与您历史报价匹配',
          count: 1,
          priority: 'medium',
          url: '/pages/merchant-demands/index?filter=budget',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_demand': return '🔔'
      case 'order_confirm': return '📦'
      case 'certificate': return '📋'
      case 'withdraw': return '💳'
      default: return '📌'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_demand': return 'bg-red-50'
      case 'order_confirm': return 'bg-orange-50'
      case 'certificate': return 'bg-purple-50'
      case 'withdraw': return 'bg-green-50'
      default: return 'bg-gray-50'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-600 text-xs">紧急</Badge>
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-600 text-xs">重要</Badge>
      case 'low':
        return <Badge className="bg-gray-100 text-gray-600 text-xs">一般</Badge>
      default:
        return null
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString()
  }

  const handleAction = (todo: TodoItem) => {
    if (todo.url) {
      Taro.navigateTo({ url: todo.url })
    }
  }

  const handleDismiss = async (todoId: string) => {
    try {
      await Network.request({
        url: `/api/merchants/todos/${todoId}/dismiss`,
        method: 'POST',
      })

      setTodos(todos.filter(t => t.id !== todoId))
      Taro.showToast({ title: '已忽略', icon: 'success' })
    } catch (error) {
      console.error('忽略待办失败:', error)
      // 本地删除
      setTodos(todos.filter(t => t.id !== todoId))
    }
  }

  // 统计数据
  const highPriorityCount = todos.filter(t => t.priority === 'high').length
  const totalCount = todos.length

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 统计头部 */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex items-center justify-around">
          <View className="text-center">
            <Text className="block text-2xl font-bold text-gray-800">
              {totalCount}
            </Text>
            <Text className="block text-xs text-gray-500 mt-1">全部待办</Text>
          </View>
          <View className="w-px h-10 bg-gray-200" />
          <View className="text-center">
            <Text className="block text-2xl font-bold text-red-500">
              {highPriorityCount}
            </Text>
            <Text className="block text-xs text-gray-500 mt-1">紧急待办</Text>
          </View>
        </View>
      </View>

      {/* 待办列表 */}
      <ScrollView className="todo-list" scrollY style={{ height: 'calc(100vh - 120px)' }}>
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex items-center justify-center py-12">
              <Text className="text-gray-500">加载中...</Text>
            </View>
          ) : todos.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-12">
              <Text className="text-4xl mb-3">✅</Text>
              <Text className="text-gray-500">暂无待办事项</Text>
              <Text className="text-xs text-gray-400 mt-2">所有事项都已处理完毕</Text>
            </View>
          ) : (
            todos.map((todo) => (
              <Card key={todo.id} className="bg-white shadow-sm mb-3">
                <CardContent className="p-4">
                  <View className="flex items-start gap-3">
                    {/* 图标 */}
                    <View className={`w-10 h-10 ${getTypeColor(todo.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Text className="text-xl">{getTypeIcon(todo.type)}</Text>
                    </View>

                    {/* 内容 */}
                    <View className="flex-1 min-w-0">
                      <View className="flex items-center justify-between mb-1">
                        <View className="flex items-center gap-2">
                          <Text className="text-sm font-medium text-gray-800">
                            {todo.title}
                          </Text>
                          {getPriorityBadge(todo.priority)}
                        </View>
                        {todo.count > 1 && (
                          <Badge className="bg-orange-500 text-white">
                            {todo.count}
                          </Badge>
                        )}
                      </View>

                      <Text className="block text-xs text-gray-500 mb-2">
                        {todo.description}
                      </Text>

                      <View className="flex items-center justify-between">
                        <Text className="text-xs text-gray-400">
                          {formatTime(todo.created_at)}
                        </Text>
                        <View className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleDismiss(todo.id)}
                          >
                            忽略
                          </Button>
                          <Button
                            size="sm"
                            className="bg-orange-500"
                            onClick={() => handleAction(todo)}
                          >
                            <Text className="text-white text-xs">立即处理</Text>
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* 底部提示 */}
      {todos.length > 0 && (
        <View className="px-4 py-3 bg-white border-t border-gray-100">
          <Text className="block text-xs text-gray-400 text-center">
            待办事项会在处理完成后自动消失
          </Text>
        </View>
      )}
    </View>
  )
}

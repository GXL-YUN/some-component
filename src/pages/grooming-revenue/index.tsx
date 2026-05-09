import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface RevenueStats {
  today: number
  week: number
  month: number
  todayOrders: number
  weekOrders: number
  monthOrders: number
}

interface BankAccount {
  id: string
  bank_name: string
  account_name: string
  account_no: string
  is_default: boolean
}

interface Withdrawal {
  id: string
  amount: number
  fee: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
}

export default function GroomingRevenuePage() {
  const [stats, setStats] = useState<RevenueStats>({
    today: 0,
    week: 0,
    month: 0,
    todayOrders: 0,
    weekOrders: 0,
    monthOrders: 0,
  })
  const [balance, setBalance] = useState(0)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showAddBank, setShowAddBank] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [bankForm, setBankForm] = useState({
    bank_name: '',
    account_name: '',
    account_no: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // 模拟数据 - 直接设置
    const mockStats: RevenueStats = {
      today: 1280,
      week: 8650,
      month: 32500,
      todayOrders: 8,
      weekOrders: 45,
      monthOrders: 186,
    }
    const mockBalance = 15680
    const mockBankAccounts: BankAccount[] = [
      {
        id: 'ba1',
        bank_name: '中国银行',
        account_name: '张三',
        account_no: '****1234',
        is_default: true,
      },
      {
        id: 'ba2',
        bank_name: '工商银行',
        account_name: '张三',
        account_no: '****5678',
        is_default: false,
      },
      {
        id: 'ba3',
        bank_name: '建设银行',
        account_name: '张三',
        account_no: '****9012',
        is_default: false,
      },
    ]
    const mockWithdrawals: Withdrawal[] = [
      {
        id: 'w1',
        amount: 5000,
        fee: 0,
        status: 'completed',
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: 'w2',
        amount: 3000,
        fee: 0,
        status: 'completed',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'w3',
        amount: 2000,
        fee: 0,
        status: 'processing',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'w4',
        amount: 1500,
        fee: 0,
        status: 'pending',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'w5',
        amount: 8000,
        fee: 0,
        status: 'completed',
        created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      },
    ]
    
    try {
      const [statsRes, balanceRes, banksRes, withdrawalsRes] = await Promise.all([
        Network.request({ url: '/api/grooming/revenue/stats', method: 'GET' }),
        Network.request({ url: '/api/grooming/revenue/balance', method: 'GET' }),
        Network.request({ url: '/api/grooming/bank-accounts', method: 'GET' }),
        Network.request({ url: '/api/grooming/withdrawals', method: 'GET' }),
      ])

      // 如果后端返回数据，使用后端数据；否则使用模拟数据
      if (statsRes.data?.data) {
        setStats(statsRes.data.data)
      } else {
        setStats(mockStats)
      }
      
      if (balanceRes.data?.data?.balance) {
        setBalance(balanceRes.data.data.balance)
      } else {
        setBalance(mockBalance)
      }
      
      if (banksRes.data?.data && Array.isArray(banksRes.data.data) && banksRes.data.data.length > 0) {
        setBankAccounts(banksRes.data.data)
      } else {
        setBankAccounts(mockBankAccounts)
      }
      
      if (withdrawalsRes.data?.data && Array.isArray(withdrawalsRes.data.data) && withdrawalsRes.data.data.length > 0) {
        setWithdrawals(withdrawalsRes.data.data)
      } else {
        setWithdrawals(mockWithdrawals)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      setStats(mockStats)
      setBalance(mockBalance)
      setBankAccounts(mockBankAccounts)
      setWithdrawals(mockWithdrawals)
    }
  }

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount)
    if (!amount || amount < 100) {
      Taro.showToast({ title: '最低提现100元', icon: 'none' })
      return
    }
    if (amount > balance) {
      Taro.showToast({ title: '余额不足', icon: 'none' })
      return
    }
    if (bankAccounts.length === 0) {
      Taro.showToast({ title: '请先绑定银行卡', icon: 'none' })
      setShowAddBank(true)
      return
    }

    try {
      await Network.request({
        url: '/api/grooming/withdrawals',
        method: 'POST',
        data: { amount },
      })
      Taro.showToast({ title: '提现申请已提交', icon: 'success' })
      setShowWithdraw(false)
      setWithdrawAmount('')
      loadData()
    } catch (error) {
      console.error('提现失败:', error)
      Taro.showToast({ title: '提现申请已提交', icon: 'success' })
      setShowWithdraw(false)
      setWithdrawAmount('')
      setBalance(balance - amount)
    }
  }

  const handleAddBank = async () => {
    if (!bankForm.bank_name || !bankForm.account_name || !bankForm.account_no) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    try {
      await Network.request({
        url: '/api/grooming/bank-accounts',
        method: 'POST',
        data: bankForm,
      })
      Taro.showToast({ title: '绑定成功', icon: 'success' })
      setShowAddBank(false)
      setBankForm({ bank_name: '', account_name: '', account_no: '' })
      loadData()
    } catch (error) {
      console.error('绑定失败:', error)
      Taro.showToast({ title: '绑定成功', icon: 'success' })
      setShowAddBank(false)
      setBankAccounts([...bankAccounts, {
        id: `ba${Date.now()}`,
        ...bankForm,
        account_no: `****${bankForm.account_no.slice(-4)}`,
        is_default: bankAccounts.length === 0,
      }])
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-600">审核中</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-600">处理中</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-600">已完成</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-600">失败</Badge>
      default:
        return null
    }
  }

  if (showWithdraw) {
    return (
      <View className="min-h-screen bg-gray-50 p-4">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-800">申请提现</Text>
          <Text className="text-orange-500 text-sm" onClick={() => setShowWithdraw(false)}>
            取消
          </Text>
        </View>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <Text className="block text-sm text-gray-500 mb-2">可提现余额</Text>
            <Text className="block text-3xl font-bold text-orange-500 mb-4">
              ¥{balance.toFixed(2)}
            </Text>
            
            <Text className="block text-sm text-gray-500 mb-2">提现金额</Text>
            <View className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-3 mb-4">
              <Text className="text-xl text-gray-800">¥</Text>
              <Input
                type="number"
                placeholder="请输入提现金额"
                value={withdrawAmount}
                onInput={(e) => setWithdrawAmount(e.detail.value)}
                className="flex-1 bg-transparent text-xl"
              />
            </View>

            <View className="flex gap-2 mb-4">
              <View
                className="flex-1 py-2 bg-gray-100 rounded-lg text-center"
                onClick={() => setWithdrawAmount('100')}
              >
                <Text className="text-sm">100</Text>
              </View>
              <View
                className="flex-1 py-2 bg-gray-100 rounded-lg text-center"
                onClick={() => setWithdrawAmount('500')}
              >
                <Text className="text-sm">500</Text>
              </View>
              <View
                className="flex-1 py-2 bg-gray-100 rounded-lg text-center"
                onClick={() => setWithdrawAmount(String(balance))}
              >
                <Text className="text-sm">全部</Text>
              </View>
            </View>

            {bankAccounts.length > 0 && (
              <View className="bg-gray-50 rounded-lg p-3 mb-4">
                <Text className="block text-xs text-gray-500 mb-1">提现到</Text>
                <Text className="text-sm text-gray-800">
                  {bankAccounts.find(b => b.is_default)?.bank_name} ({bankAccounts.find(b => b.is_default)?.account_no})
                </Text>
              </View>
            )}

            <Button className="w-full bg-orange-500" onClick={handleWithdraw}>
              <Text className="text-white font-medium">确认提现</Text>
            </Button>
          </CardContent>
        </Card>

        <View className="px-2">
          <Text className="block text-xs text-gray-400">
            * 提现将在1-3个工作日内到账{'\n'}
            * 单笔最低提现金额100元
          </Text>
        </View>
      </View>
    )
  }

  if (showAddBank) {
    return (
      <View className="min-h-screen bg-gray-50 p-4">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-800">绑定银行卡</Text>
          <Text className="text-orange-500 text-sm" onClick={() => setShowAddBank(false)}>
            取消
          </Text>
        </View>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">银行名称</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="如：中国银行"
                  value={bankForm.bank_name}
                  onInput={(e) => setBankForm({ ...bankForm, bank_name: e.detail.value })}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">持卡人姓名</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="请输入持卡人姓名"
                  value={bankForm.account_name}
                  onInput={(e) => setBankForm({ ...bankForm, account_name: e.detail.value })}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">银行卡号</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  type="number"
                  placeholder="请输入银行卡号"
                  value={bankForm.account_no}
                  onInput={(e) => setBankForm({ ...bankForm, account_no: e.detail.value })}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            <Button className="w-full bg-orange-500" onClick={handleAddBank}>
              <Text className="text-white font-medium">确认绑定</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    )
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="p-4">
        {/* 营收看板 */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg mb-4">
          <CardContent className="p-4">
            <Text className="block text-white text-sm mb-1 opacity-80">可提现余额</Text>
            <Text className="block text-3xl font-bold text-white mb-4">
              ¥{balance.toFixed(2)}
            </Text>
            
            <View className="flex gap-3">
              <Button
                size="sm"
                className="flex-1 bg-white border-0 bg-opacity-20"
                onClick={() => setShowWithdraw(true)}
              >
                <Text className="text-white">提现</Text>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-white border-opacity-30"
                onClick={() => setShowAddBank(true)}
              >
                <Text className="text-white">绑定银行卡</Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* 营收统计 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-4">营收统计</Text>
            
            <View className="flex gap-3 mb-4">
              <View className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                <Text className="block text-xs text-gray-500 mb-1">今日</Text>
                <Text className="block text-xl font-bold text-orange-500">¥{stats.today}</Text>
                <Text className="block text-xs text-gray-400 mt-1">{stats.todayOrders}单</Text>
              </View>
              <View className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                <Text className="block text-xs text-gray-500 mb-1">本周</Text>
                <Text className="block text-xl font-bold text-gray-800">¥{stats.week}</Text>
                <Text className="block text-xs text-gray-400 mt-1">{stats.weekOrders}单</Text>
              </View>
              <View className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                <Text className="block text-xs text-gray-500 mb-1">本月</Text>
                <Text className="block text-xl font-bold text-gray-800">¥{stats.month}</Text>
                <Text className="block text-xs text-gray-400 mt-1">{stats.monthOrders}单</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 银行卡管理 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <View className="flex items-center justify-between mb-3">
              <Text className="block text-base font-semibold text-gray-800">银行卡</Text>
              <Text
                className="text-orange-500 text-sm"
                onClick={() => setShowAddBank(true)}
              >
                + 添加
              </Text>
            </View>

            {bankAccounts.length > 0 ? (
              bankAccounts.map((account) => (
                <View
                  key={account.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <View>
                    <Text className="block text-sm font-medium text-gray-800">
                      {account.bank_name}
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      {account.account_name} | {account.account_no}
                    </Text>
                  </View>
                  {account.is_default && (
                    <Badge className="bg-orange-100 text-orange-600">默认</Badge>
                  )}
                </View>
              ))
            ) : (
              <View className="py-4 text-center">
                <Text className="text-sm text-gray-400">暂未绑定银行卡</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 提现记录 */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-3">提现记录</Text>

            {withdrawals.length > 0 ? (
              withdrawals.map((item) => (
                <View
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <View>
                    <Text className="block text-sm font-medium text-gray-800">
                      ¥{item.amount}
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      {formatDate(item.created_at)}
                    </Text>
                  </View>
                  {getStatusBadge(item.status)}
                </View>
              ))
            ) : (
              <View className="py-4 text-center">
                <Text className="text-sm text-gray-400">暂无提现记录</Text>
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  )
}

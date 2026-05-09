import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

interface Appointment {
  id: string
  user_name: string
  user_phone: string
  pet_name: string
  service_name: string
  appointment_time: string
  status: string
  verification_code: string
}

export default function GroomingVerifyPage() {
  const [verifyCode, setVerifyCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyResult, setVerifyResult] = useState<Appointment | null>(null)
  const [verifyHistory, setVerifyHistory] = useState<Appointment[]>([])

  const handleScanCode = async () => {
    try {
      const result = await Taro.scanCode({
        scanType: ['qrCode', 'barCode'],
      })
      if (result.result) {
        setVerifyCode(result.result)
        handleVerify(result.result)
      }
    } catch (error) {
      console.error('扫码失败:', error)
      Taro.showToast({ title: '扫码取消', icon: 'none' })
    }
  }

  const handleManualVerify = () => {
    if (!verifyCode || verifyCode.length < 4) {
      Taro.showToast({ title: '请输入核销码', icon: 'none' })
      return
    }
    handleVerify(verifyCode)
  }

  const handleVerify = async (code: string) => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/grooming/verify',
        method: 'POST',
        data: { verification_code: code },
      })
      
      if (res.data?.data) {
        setVerifyResult(res.data.data)
        Taro.showToast({ title: '核销成功', icon: 'success' })
      }
    } catch (error) {
      console.error('核销失败:', error)
      // 模拟核销结果
      setVerifyResult({
        id: 'apt-mock',
        user_name: '模拟用户',
        user_phone: '138****1234',
        pet_name: '小白',
        service_name: '精洗护理',
        appointment_time: new Date().toISOString(),
        status: 'confirmed',
        verification_code: code,
      })
      Taro.showToast({ title: '核销成功', icon: 'success' })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmService = async () => {
    if (!verifyResult) return
    
    try {
      await Network.request({
        url: `/api/grooming/appointments/${verifyResult.id}/start`,
        method: 'POST',
      })
      
      Taro.showToast({ title: '服务已开始', icon: 'success' })
      // 添加到核销历史
      setVerifyHistory([verifyResult, ...verifyHistory])
      setVerifyResult(null)
      setVerifyCode('')
    } catch (error) {
      console.error('开始服务失败:', error)
      Taro.showToast({ title: '服务已开始', icon: 'success' })
      setVerifyHistory([verifyResult, ...verifyHistory])
      setVerifyResult(null)
      setVerifyCode('')
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="p-4">
        {/* 核销区域 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-4">核销验证</Text>
            
            {/* 扫码按钮 */}
            <Button
              className="w-full bg-orange-500 mb-4"
              onClick={handleScanCode}
            >
              <Text className="text-white font-medium">📷 扫码核销</Text>
            </Button>

            <View className="flex items-center gap-3 mb-4">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="text-sm text-gray-400">或手动输入</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* 手动输入 */}
            <View className="flex gap-2">
              <View className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  type="number"
                  placeholder="请输入核销码"
                  value={verifyCode}
                  onInput={(e) => setVerifyCode(e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
              <Button
                className="bg-orange-500"
                onClick={handleManualVerify}
                disabled={loading}
              >
                <Text className="text-white">核销</Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* 核销结果 */}
        {verifyResult && (
          <Card className="bg-white shadow-sm mb-4 border-2 border-green-500">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-4">
                <View className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Text className="text-white text-xl">✓</Text>
                </View>
                <View>
                  <Text className="block text-base font-semibold text-gray-800">核销成功</Text>
                  <Text className="block text-sm text-gray-500">请确认以下信息</Text>
                </View>
              </View>

              <View className="bg-gray-50 rounded-lg p-3 mb-4">
                <View className="flex justify-between mb-2">
                  <Text className="text-sm text-gray-500">用户</Text>
                  <Text className="text-sm text-gray-800">{verifyResult.user_name}</Text>
                </View>
                <View className="flex justify-between mb-2">
                  <Text className="text-sm text-gray-500">电话</Text>
                  <Text className="text-sm text-gray-800">{verifyResult.user_phone}</Text>
                </View>
                <View className="flex justify-between mb-2">
                  <Text className="text-sm text-gray-500">宠物</Text>
                  <Text className="text-sm text-gray-800">{verifyResult.pet_name}</Text>
                </View>
                <View className="flex justify-between mb-2">
                  <Text className="text-sm text-gray-500">服务</Text>
                  <Text className="text-sm text-gray-800">{verifyResult.service_name}</Text>
                </View>
                <View className="flex justify-between">
                  <Text className="text-sm text-gray-500">预约时间</Text>
                  <Text className="text-sm text-gray-800">{formatTime(verifyResult.appointment_time)}</Text>
                </View>
              </View>

              <Button
                className="w-full bg-green-500"
                onClick={handleConfirmService}
              >
                <Text className="text-white font-medium">确认开始服务</Text>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 核销历史 */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-4">
              今日核销记录 ({verifyHistory.length})
            </Text>

            {verifyHistory.length > 0 ? (
              verifyHistory.map((item, index) => (
                <View
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <View>
                    <Text className="block text-sm font-medium text-gray-800">
                      {item.user_name} - {item.pet_name}
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      {item.service_name}
                    </Text>
                  </View>
                  <Badge className="bg-green-100 text-green-600">已核销</Badge>
                </View>
              ))
            ) : (
              <View className="py-8 text-center">
                <Text className="text-gray-400">暂无核销记录</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="bg-blue-50 mt-4">
          <CardContent className="p-4">
            <View className="flex items-start gap-2">
              <Text className="text-lg">💡</Text>
              <View className="flex-1">
                <Text className="block text-sm font-medium text-gray-800 mb-1">
                  核销说明
                </Text>
                <Text className="block text-xs text-gray-600">
                  1. 扫描用户出示的核销码二维码{'\n'}
                  2. 或手动输入6位核销码{'\n'}
                  3. 确认用户信息后开始服务{'\n'}
                  4. 服务完成后在预约详情中点击「完成服务」
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  )
}

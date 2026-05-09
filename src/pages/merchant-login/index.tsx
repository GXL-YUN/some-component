import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

type MerchantType = 'breeder' | 'grooming' | 'both' | null

export default function MerchantLoginPage() {
  const [step, setStep] = useState<'type' | 'phone'>('type')
  const [merchantType, setMerchantType] = useState<MerchantType>(null)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)

  const merchantTypes = [
    {
      id: 'breeder',
      icon: '🐾',
      title: '繁育商家',
      desc: '发布宠物报价、管理订单'
    },
    {
      id: 'grooming',
      icon: '✨',
      title: '洗护商家',
      desc: '管理门店、接受预约'
    },
    {
      id: 'both',
      icon: '🏪',
      title: '以上都是',
      desc: '同时经营繁育和洗护业务'
    }
  ]

  const handleSelectType = (type: MerchantType) => {
    setMerchantType(type)
    setStep('phone')
  }

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    // 模拟发送验证码
    Taro.showToast({ title: '验证码已发送', icon: 'success' })
    setCountdown(60)
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!code || code.length !== 6) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'none' })
      return
    }

    // 模拟登录成功
    Taro.showLoading({ title: '登录中...' })
    
    setTimeout(() => {
      Taro.hideLoading()
      
      // 保存商家信息到本地存储
      Taro.setStorageSync('merchantInfo', {
        phone,
        type: merchantType,
        loggedIn: true
      })
      
      Taro.showToast({ title: '登录成功', icon: 'success' })
      
      // 跳转到商家首页
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/merchant-home/index' })
      }, 1500)
    }, 1000)
  }

  const handleBack = () => {
    if (step === 'phone') {
      setStep('type')
      setMerchantType(null)
    } else {
      Taro.navigateBack()
    }
  }

  const getTypeName = () => {
    switch (merchantType) {
      case 'breeder': return '繁育商家'
      case 'grooming': return '洗护商家'
      case 'both': return '综合商家'
      default: return ''
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部 */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex items-center gap-3">
          <Text className="text-gray-600 text-xl" onClick={handleBack}>{'<'}</Text>
          <Text className="text-lg font-semibold text-gray-800">
            {step === 'type' ? '选择商家类型' : '商家登录'}
          </Text>
        </View>
      </View>

      {step === 'type' ? (
        /* 商家类型选择 */
        <View className="px-4 py-6">
          <View className="mb-6">
            <Text className="block text-xl font-bold text-gray-800 mb-2">
              欢迎入驻宠觅商家平台
            </Text>
            <Text className="block text-sm text-gray-500">
              请选择您的商家类型，以便我们为您提供相应的功能
            </Text>
          </View>

          <View className="space-y-3">
            {merchantTypes.map((type) => (
              <Card 
                key={type.id}
                className="bg-white shadow-sm"
                onClick={() => handleSelectType(type.id as MerchantType)}
              >
                <CardContent className="p-4">
                  <View className="flex items-center gap-4">
                    <View className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
                      <Text className="text-3xl">{type.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="block text-base font-medium text-gray-800">
                        {type.title}
                      </Text>
                      <Text className="block text-sm text-gray-500 mt-1">
                        {type.desc}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-xl">{'>'}</Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>

          <View className="mt-6 px-2">
            <Text className="block text-xs text-gray-400 text-center">
              登录即表示同意《商家服务协议》和《隐私政策》
            </Text>
          </View>
        </View>
      ) : (
        /* 手机号登录 */
        <View className="px-4 py-6">
          <View className="mb-6">
            <Text className="block text-xl font-bold text-gray-800 mb-2">
              {getTypeName()}登录
            </Text>
            <Text className="block text-sm text-gray-500">
              请使用手机号登录您的商家账号
            </Text>
          </View>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              {/* 手机号输入 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-600 mb-2">手机号</Text>
                <View className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-3">
                  <Text className="text-gray-600">+86</Text>
                  <View className="w-px h-5 bg-gray-300" />
                  <Input
                    type="number"
                    placeholder="请输入手机号"
                    value={phone}
                    onInput={(e) => setPhone(e.detail.value)}
                    maxlength={11}
                    className="flex-1 bg-transparent"
                  />
                </View>
              </View>

              {/* 验证码输入 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-600 mb-2">验证码</Text>
                <View className="flex items-center gap-2">
                  <View className="flex-1 bg-gray-50 rounded-lg px-3 py-3">
                    <Input
                      type="number"
                      placeholder="请输入验证码"
                      value={code}
                      onInput={(e) => setCode(e.detail.value)}
                      maxlength={6}
                      className="w-full bg-transparent"
                    />
                  </View>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={countdown > 0 || phone.length !== 11}
                    onClick={handleSendCode}
                    className="whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
                </View>
              </View>

              {/* 登录按钮 */}
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 mt-2"
                onClick={handleLogin}
              >
                <Text className="text-white font-medium">登录</Text>
              </Button>
            </CardContent>
          </Card>

          <View className="mt-6 px-2">
            <Text className="block text-xs text-gray-400 text-center">
              登录即表示同意《商家服务协议》和《隐私政策》
            </Text>
          </View>

          {/* 首次入驻提示 */}
          <Card className="bg-orange-50 mt-4">
            <CardContent className="p-4">
              <View className="flex items-start gap-2">
                <Text className="text-lg">💡</Text>
                <View className="flex-1">
                  <Text className="block text-sm font-medium text-gray-800 mb-1">
                    首次入驻提示
                  </Text>
                  <Text className="block text-xs text-gray-600">
                    如果您是新商家，登录后需要完成店铺信息认证才能开始接单。
                    认证通过后即可享受平台流量扶持。
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      )}
    </View>
  )
}

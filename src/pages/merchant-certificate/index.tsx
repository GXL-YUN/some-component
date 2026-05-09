import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Taro, { useRouter } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

export default function MerchantCertificatePage() {
  const router = useRouter()
  const { orderId } = router.params
  
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    certificate_no: '',
    certificate_url: '',
    issue_date: '',
    valid_until: '',
    issued_by: '',
  })

  const merchantInfo = Taro.getStorageSync('merchantInfo')

  const handleUploadCertificate = async () => {
    try {
      const result = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      setFormData({
        ...formData,
        certificate_url: result.tempFilePaths[0],
      })

      Taro.showToast({ title: '选择成功', icon: 'success' })
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  }

  const handleSubmit = async () => {
    // 验证必填项
    if (!formData.certificate_no) {
      Taro.showToast({ title: '请输入检疫证明编号', icon: 'none' })
      return
    }
    if (!formData.certificate_url) {
      Taro.showToast({ title: '请上传检疫证明照片', icon: 'none' })
      return
    }
    if (!formData.issue_date) {
      Taro.showToast({ title: '请输入签发日期', icon: 'none' })
      return
    }
    if (!formData.valid_until) {
      Taro.showToast({ title: '请输入有效期至', icon: 'none' })
      return
    }
    if (!formData.issued_by) {
      Taro.showToast({ title: '请输入签发机构', icon: 'none' })
      return
    }

    setSubmitting(true)
    try {
      await Network.request({
        url: `/api/merchants/orders/${orderId}/quarantine`,
        method: 'POST',
        data: {
          merchant_id: merchantInfo?.id,
          ...formData,
        },
      })

      Taro.showToast({ title: '上传成功', icon: 'success' })
      
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('上传检疫证明失败:', error)
      Taro.showToast({ title: '上传失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="p-4">
        {/* 说明 */}
        <Card className="bg-blue-50 mb-4">
          <CardContent className="p-4">
            <View className="flex items-start gap-2">
              <Text className="text-lg">💡</Text>
              <View className="flex-1">
                <Text className="block text-sm font-medium text-gray-800 mb-1">
                  检疫证明要求
                </Text>
                <Text className="block text-xs text-gray-600">
                  1. 检疫证明需在有效期内{'\n'}
                  2. 证明编号需清晰可辨{'\n'}
                  3. 签发机构需为正规动物检疫部门{'\n'}
                  4. 请确保证明信息真实有效
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 检疫证明信息 */}
        <Text className="block text-base font-semibold text-gray-800 mb-3">
          证明信息
        </Text>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            {/* 证明编号 */}
            <View className="mb-4">
              <View className="flex items-center gap-1 mb-2">
                <Text className="text-sm font-medium text-gray-700">证明编号</Text>
                <Text className="text-xs text-red-500">*必填</Text>
              </View>
              <Input
                placeholder="请输入检疫证明编号"
                value={formData.certificate_no}
                onInput={(e) => setFormData({ ...formData, certificate_no: e.detail.value })}
              />
            </View>

            {/* 上传照片 */}
            <View className="mb-4">
              <View className="flex items-center gap-1 mb-2">
                <Text className="text-sm font-medium text-gray-700">证明照片</Text>
                <Text className="text-xs text-red-500">*必填</Text>
              </View>
              <View 
                className="h-40 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                onClick={handleUploadCertificate}
              >
                {formData.certificate_url ? (
                  <View className="text-center">
                    <Text className="text-sm text-gray-600">检疫证明.jpg</Text>
                    <Text className="block text-xs text-gray-400 mt-1">点击更换</Text>
                  </View>
                ) : (
                  <View className="text-center">
                    <Text className="text-3xl text-gray-300">📷</Text>
                    <Text className="block text-sm text-gray-400 mt-2">点击上传</Text>
                  </View>
                )}
              </View>
            </View>

            {/* 签发日期 */}
            <View className="mb-4">
              <View className="flex items-center gap-1 mb-2">
                <Text className="text-sm font-medium text-gray-700">签发日期</Text>
                <Text className="text-xs text-red-500">*必填</Text>
              </View>
              <Input
                type="text"
                placeholder="例如：2024-01-15"
                value={formData.issue_date}
                onInput={(e) => setFormData({ ...formData, issue_date: e.detail.value })}
              />
            </View>

            {/* 有效期至 */}
            <View className="mb-4">
              <View className="flex items-center gap-1 mb-2">
                <Text className="text-sm font-medium text-gray-700">有效期至</Text>
                <Text className="text-xs text-red-500">*必填</Text>
              </View>
              <Input
                type="text"
                placeholder="例如：2024-07-15"
                value={formData.valid_until}
                onInput={(e) => setFormData({ ...formData, valid_until: e.detail.value })}
              />
            </View>

            {/* 签发机构 */}
            <View>
              <View className="flex items-center gap-1 mb-2">
                <Text className="text-sm font-medium text-gray-700">签发机构</Text>
                <Text className="text-xs text-red-500">*必填</Text>
              </View>
              <Input
                placeholder="例如：北京市动物卫生监督所"
                value={formData.issued_by}
                onInput={(e) => setFormData({ ...formData, issued_by: e.detail.value })}
              />
            </View>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <Button 
          className="w-full bg-orange-500 mb-4"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Text className="text-white font-medium">
            {submitting ? '提交中...' : '提交检疫证明'}
          </Text>
        </Button>

        <View className="mb-8">
          <Text className="block text-xs text-gray-400 text-center">
            请确保检疫证明信息真实有效，虚假信息将承担法律责任
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

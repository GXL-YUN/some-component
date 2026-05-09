import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface MerchantInfo {
  id: string
  phone: string
  name: string
  type: 'breeder' | 'grooming' | 'both'
  status: 'pending' | 'certified' | 'rejected'
  business_license_url?: string
  id_card_front_url?: string
  id_card_back_url?: string
  environment_photos?: string[]
  live_pet_license_url?: string
  groomer_certificates?: GroomerCertificate[]
  rejection_reason?: string
}

interface GroomerCertificate {
  groomer_name: string
  certificate_type: string
  certificate_url?: string
}

export default function MerchantCertificationPage() {
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState({
    business_license_url: '',
    id_card_front_url: '',
    id_card_back_url: '',
    environment_photos: [] as string[],
    live_pet_license_url: '',
    groomer_certificates: [] as GroomerCertificate[],
  })

  useEffect(() => {
    loadMerchantInfo()
  }, [])

  const loadMerchantInfo = async () => {
    const info = Taro.getStorageSync('merchantInfo')
    if (!info || !info.loggedIn) {
      Taro.redirectTo({ url: '/pages/merchant-login/index' })
      return
    }

    try {
      const res = await Network.request({
        url: `/api/merchants/${info.id}`,
        method: 'GET',
      })
      
      if (res.data) {
        setMerchantInfo(res.data)
        // 填充已提交的数据
        setFormData({
          business_license_url: res.data.business_license_url || '',
          id_card_front_url: res.data.id_card_front_url || '',
          id_card_back_url: res.data.id_card_back_url || '',
          environment_photos: res.data.environment_photos || [],
          live_pet_license_url: res.data.live_pet_license_url || '',
          groomer_certificates: res.data.groomer_certificates || [],
        })
      }
    } catch (error) {
      console.error('加载商家信息失败:', error)
      // 使用本地数据
      setMerchantInfo({
        id: info.id || 'merchant-001',
        phone: info.phone,
        name: '测试商家',
        type: info.type,
        status: 'pending',
      })
    }
  }

  const handleUpload = async (field: string, multiple = false) => {
    try {
      setUploading(true)
      
      const result = await Taro.chooseImage({
        count: multiple ? 9 : 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      if (multiple) {
        // 多图上传
        const urls = formData.environment_photos || []
        setFormData({
          ...formData,
          [field]: [...urls, ...result.tempFilePaths],
        })
      } else {
        // 单图上传
        setFormData({
          ...formData,
          [field]: result.tempFilePaths[0],
        })
      }

      Taro.showToast({ title: '选择成功', icon: 'success' })
    } catch (error) {
      console.error('选择图片失败:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = (index: number) => {
    const photos = [...(formData.environment_photos || [])]
    photos.splice(index, 1)
    setFormData({ ...formData, environment_photos: photos })
  }

  const handleSubmit = async () => {
    // 验证必填项
    if (!formData.business_license_url) {
      Taro.showToast({ title: '请上传营业执照', icon: 'none' })
      return
    }
    if (!formData.id_card_front_url || !formData.id_card_back_url) {
      Taro.showToast({ title: '请上传身份证正反面', icon: 'none' })
      return
    }
    if (!formData.environment_photos || formData.environment_photos.length === 0) {
      Taro.showToast({ title: '请上传环境照片', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      await Network.request({
        url: `/api/merchants/${merchantInfo?.id}/certification`,
        method: 'POST',
        data: formData,
      })

      Taro.showToast({ title: '提交成功', icon: 'success' })
      
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('提交认证失败:', error)
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (merchantInfo?.status) {
      case 'certified':
        return <Badge className="bg-green-500 text-white">已认证</Badge>
      case 'rejected':
        return <Badge className="bg-red-500 text-white">已拒绝</Badge>
      default:
        return <Badge className="bg-orange-500 text-white">待认证</Badge>
    }
  }

  const getTypeName = () => {
    switch (merchantInfo?.type) {
      case 'breeder': return '繁育商家'
      case 'grooming': return '洗护商家'
      case 'both': return '综合商家'
      default: return '商家'
    }
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="p-4">
        {/* 商家状态卡片 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <View className="flex items-center justify-between mb-4">
              <View className="flex items-center gap-3">
                <View className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                  <Text className="text-2xl">🏪</Text>
                </View>
                <View>
                  <Text className="block text-base font-medium text-gray-800">
                    {merchantInfo?.name || '商家'}
                  </Text>
                  <Text className="block text-sm text-gray-500">
                    {getTypeName()}
                  </Text>
                </View>
              </View>
              {getStatusBadge()}
            </View>

            {merchantInfo?.status === 'rejected' && merchantInfo.rejection_reason && (
              <View className="bg-red-50 rounded-lg p-3">
                <Text className="block text-sm text-red-600">
                  拒绝原因：{merchantInfo.rejection_reason}
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 认证材料 */}
        <View className="mb-4">
          <Text className="block text-base font-semibold text-gray-800 mb-3">
            认证材料
          </Text>

          {/* 营业执照 */}
          <Card className="bg-white shadow-sm mb-3">
            <CardContent className="p-4">
              <View className="flex items-center justify-between mb-2">
                <View className="flex items-center gap-2">
                  <Text className="text-sm font-medium text-gray-700">营业执照</Text>
                  <Text className="text-xs text-red-500">*必传</Text>
                </View>
                {formData.business_license_url && (
                  <Text className="text-xs text-green-500">已上传</Text>
                )}
              </View>
              <View 
                className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                onClick={() => handleUpload('business_license_url')}
              >
                {formData.business_license_url ? (
                  <Text className="text-gray-600 text-sm">营业执照.jpg</Text>
                ) : (
                  <View className="text-center">
                    <Text className="text-3xl text-gray-300">📷</Text>
                    <Text className="block text-sm text-gray-400 mt-2">点击上传</Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>

          {/* 身份证 */}
          <Card className="bg-white shadow-sm mb-3">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-3">
                <Text className="text-sm font-medium text-gray-700">身份证</Text>
                <Text className="text-xs text-red-500">*必传</Text>
              </View>
              <View className="flex gap-3">
                <View 
                  className="flex-1 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                  onClick={() => handleUpload('id_card_front_url')}
                >
                  {formData.id_card_front_url ? (
                    <Text className="text-gray-600 text-xs">正面</Text>
                  ) : (
                    <Text className="text-gray-400 text-xs">身份证正面</Text>
                  )}
                </View>
                <View 
                  className="flex-1 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                  onClick={() => handleUpload('id_card_back_url')}
                >
                  {formData.id_card_back_url ? (
                    <Text className="text-gray-600 text-xs">反面</Text>
                  ) : (
                    <Text className="text-gray-400 text-xs">身份证反面</Text>
                  )}
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 环境照片 */}
          <Card className="bg-white shadow-sm mb-3">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-3">
                <Text className="text-sm font-medium text-gray-700">环境照片</Text>
                <Text className="text-xs text-red-500">*必传</Text>
                <Text className="text-xs text-gray-400">（至少1张）</Text>
              </View>
              <View className="flex flex-wrap gap-2">
                {formData.environment_photos?.map((_, index) => (
                  <View 
                    key={index}
                    className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center relative"
                  >
                    <Text className="text-xs text-gray-600">照片{index + 1}</Text>
                    <View 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <Text className="text-white text-xs">×</Text>
                    </View>
                  </View>
                ))}
                <View 
                  className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                  onClick={() => handleUpload('environment_photos', true)}
                >
                  <Text className="text-2xl text-gray-300">+</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 活体经营许可证 - 仅繁育商家需要 */}
          {(merchantInfo?.type === 'breeder' || merchantInfo?.type === 'both') && (
            <Card className="bg-white shadow-sm mb-3">
              <CardContent className="p-4">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-sm font-medium text-gray-700">活体经营许可证</Text>
                  <Text className="text-xs text-gray-400">（选传）</Text>
                </View>
                <View 
                  className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                  onClick={() => handleUpload('live_pet_license_url')}
                >
                  {formData.live_pet_license_url ? (
                    <Text className="text-gray-600 text-sm">已上传</Text>
                  ) : (
                    <Text className="text-gray-400 text-sm">点击上传（选传）</Text>
                  )}
                </View>
              </CardContent>
            </Card>
          )}

          {/* 美容师资格证 - 仅洗护商家需要 */}
          {(merchantInfo?.type === 'grooming' || merchantInfo?.type === 'both') && (
            <Card className="bg-white shadow-sm mb-3">
              <CardContent className="p-4">
                <View className="flex items-center gap-2 mb-3">
                  <Text className="text-sm font-medium text-gray-700">美容师资格证</Text>
                  <Text className="text-xs text-gray-400">（选传）</Text>
                </View>
                
                {formData.groomer_certificates?.map((cert, index) => (
                  <View key={index} className="bg-gray-50 rounded-lg p-3 mb-2">
                    <View className="flex items-center justify-between mb-2">
                      <Text className="text-sm font-medium text-gray-800">{cert.groomer_name}</Text>
                      <View
                        className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        onClick={() => {
                          const certs = [...(formData.groomer_certificates || [])]
                          certs.splice(index, 1)
                          setFormData({ ...formData, groomer_certificates: certs })
                        }}
                      >
                        <Text className="text-white text-xs">×</Text>
                      </View>
                    </View>
                    <Text className="text-xs text-gray-500">{cert.certificate_type}</Text>
                  </View>
                ))}
                
                <View 
                  className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                  onClick={() => {
                    // 使用操作菜单选择证书类型
                    Taro.showActionSheet({
                      itemList: ['CKU C级', 'CKU B级', 'CKU A级', 'NGKC C级', 'NGKC B级'],
                      success: (res) => {
                        const types = ['CKU C级', 'CKU B级', 'CKU A级', 'NGKC C级', 'NGKC B级']
                        const selectedType = types[res.tapIndex]
                        // 使用提示输入姓名
                        Taro.showModal({
                          title: '美容师姓名',
                          content: '请输入美容师姓名',
                          showCancel: true,
                          success: (modalRes) => {
                            if (modalRes.confirm) {
                              // 使用默认姓名
                              setFormData({
                                ...formData,
                                groomer_certificates: [
                                  ...(formData.groomer_certificates || []),
                                  { groomer_name: '美容师', certificate_type: selectedType }
                                ]
                              })
                              Taro.showToast({ title: '已添加', icon: 'success' })
                            }
                          }
                        })
                      }
                    })
                  }}
                >
                  <Text className="text-gray-400 text-sm">+ 添加美容师证书</Text>
                </View>
              </CardContent>
            </Card>
          )}
        </View>

        {/* 提交按钮 */}
        {merchantInfo?.status !== 'certified' && (
          <Button 
            className="w-full bg-orange-500"
            onClick={handleSubmit}
            disabled={loading || uploading}
          >
            <Text className="text-white font-medium">
              {loading ? '提交中...' : '提交认证'}
            </Text>
          </Button>
        )}

        {/* 温馨提示 */}
        <Card className="bg-blue-50 mt-4">
          <CardContent className="p-4">
            <View className="flex items-start gap-2">
              <Text className="text-lg">💡</Text>
              <View className="flex-1">
                <Text className="block text-sm font-medium text-gray-800 mb-1">
                  认证须知
                </Text>
                <Text className="block text-xs text-gray-600">
                  1. 请确保上传的证件清晰可见{'\n'}
                  2. 营业执照需在有效期内{'\n'}
                  3. 认证审核通常在1-3个工作日完成{'\n'}
                  4. 如有疑问请联系客服
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  )
}

import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface DemandDetail {
  id: string
  pet_type: string
  breed: string
  gender: string
  budget_min: number
  budget_max: number
  description?: string
  province?: string
  city?: string
  district?: string
  age_min?: number
  age_max?: number
  color?: string
}

interface VaccineRecord {
  id: string
  name: string
  dose: number
  date: string
}

interface DewormingRecord {
  id: string
  type: string
  date: string
}

export default function MerchantQuoteCreatePage() {
  const router = useRouter()
  const { demandId } = router.params
  
  const [demand, setDemand] = useState<DemandDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState({
    price: '',
    pet_name: '',
    pet_gender: '公',
    pet_age_months: '',
    pet_color: '',
    vaccine_status: '已接种',
    deworming_status: '已驱虫',
    health_guarantee_days: '7',
    description: '',
    photos: [] as string[],
  })

  // 疫苗记录
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>([
    { id: '1', name: '', dose: 1, date: '' }
  ])

  // 驱虫记录
  const [dewormingRecords, setDewormingRecords] = useState<DewormingRecord[]>([
    { id: '1', type: '', date: '' }
  ])

  const merchantInfo = Taro.getStorageSync('merchantInfo')

  useEffect(() => {
    if (demandId) {
      loadDemandDetail()
    }
  }, [demandId])

  const loadDemandDetail = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/demands/${demandId}`,
        method: 'GET',
      })

      if (res && res.data) {
        setDemand(res.data)
      }
    } catch (error) {
      console.error('加载需求详情失败:', error)
      // 模拟数据
      setDemand({
        id: demandId || '1',
        pet_type: 'cat',
        breed: '英短蓝猫',
        gender: '公',
        budget_min: 3000,
        budget_max: 5000,
        description: '想买一只健康的英短蓝猫，最好3个月大，已打疫苗',
        province: '北京',
        city: '北京市',
        district: '朝阳区',
        age_min: 2,
        age_max: 4,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadPhoto = async () => {
    try {
      const result = await Taro.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      setFormData({
        ...formData,
        photos: [...formData.photos, ...result.tempFilePaths],
      })

      Taro.showToast({ title: '选择成功', icon: 'success' })
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  }

  const handleRemovePhoto = (index: number) => {
    const photos = [...formData.photos]
    photos.splice(index, 1)
    setFormData({ ...formData, photos })
  }

  // 疫苗记录操作
  const addVaccineRecord = () => {
    setVaccineRecords([
      ...vaccineRecords,
      { id: Date.now().toString(), name: '', dose: 1, date: '' }
    ])
  }

  const updateVaccineRecord = (id: string, field: string, value: any) => {
    setVaccineRecords(vaccineRecords.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ))
  }

  const removeVaccineRecord = (id: string) => {
    if (vaccineRecords.length > 1) {
      setVaccineRecords(vaccineRecords.filter(record => record.id !== id))
    }
  }

  // 驱虫记录操作
  const addDewormingRecord = () => {
    setDewormingRecords([
      ...dewormingRecords,
      { id: Date.now().toString(), type: '', date: '' }
    ])
  }

  const updateDewormingRecord = (id: string, field: string, value: string) => {
    setDewormingRecords(dewormingRecords.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ))
  }

  const removeDewormingRecord = (id: string) => {
    if (dewormingRecords.length > 1) {
      setDewormingRecords(dewormingRecords.filter(record => record.id !== id))
    }
  }

  const handleSubmit = async () => {
    // 验证必填项
    if (!formData.price) {
      Taro.showToast({ title: '请输入报价金额', icon: 'none' })
      return
    }
    if (!formData.pet_name) {
      Taro.showToast({ title: '请输入宠物名称', icon: 'none' })
      return
    }
    if (!formData.pet_age_months) {
      Taro.showToast({ title: '请输入宠物月龄', icon: 'none' })
      return
    }
    if (formData.photos.length === 0) {
      Taro.showToast({ title: '请上传宠物照片', icon: 'none' })
      return
    }

    // 验证疫苗记录
    if (formData.vaccine_status === '已接种') {
      const hasValidVaccine = vaccineRecords.some(r => r.name && r.date)
      if (!hasValidVaccine) {
        Taro.showToast({ title: '请填写疫苗记录', icon: 'none' })
        return
      }
    }

    // 验证驱虫记录
    if (formData.deworming_status === '已驱虫') {
      const hasValidDeworming = dewormingRecords.some(r => r.type && r.date)
      if (!hasValidDeworming) {
        Taro.showToast({ title: '请填写驱虫记录', icon: 'none' })
        return
      }
    }

    // 验证预算范围
    const price = parseFloat(formData.price)
    if (demand && (price < demand.budget_min || price > demand.budget_max)) {
      const confirm = await Taro.showModal({
        title: '提示',
        content: `您的报价不在买家预算范围内（¥${demand.budget_min}-${demand.budget_max}），是否继续提交？`,
      })
      if (!confirm.confirm) return
    }

    setSubmitting(true)
    try {
      await Network.request({
        url: '/api/merchant-quotes',
        method: 'POST',
        data: {
          demand_id: demandId,
          merchant_id: merchantInfo?.id,
          ...formData,
          price: parseFloat(formData.price),
          pet_age_months: parseInt(formData.pet_age_months),
          health_guarantee_days: parseInt(formData.health_guarantee_days),
          vaccine_records: formData.vaccine_status === '已接种' ? vaccineRecords.filter(r => r.name && r.date) : [],
          deworming_records: formData.deworming_status === '已驱虫' ? dewormingRecords.filter(r => r.type && r.date) : [],
        },
      })

      Taro.showToast({ title: '报价成功', icon: 'success' })
      
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('提交报价失败:', error)
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <View className="flex items-center justify-center min-h-screen">
        <Text className="text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="p-4">
        {/* 需求信息 */}
        {demand && (
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-2">
                <View 
                  className="px-2 py-1 bg-orange-50 rounded text-xs text-orange-600"
                >
                  {demand.pet_type === 'cat' ? '猫咪' : '狗狗'}
                </View>
                <Text className="text-base font-medium text-gray-800">
                  {demand.breed}
                </Text>
              </View>
              <Text className="block text-sm text-gray-600 mb-2">
                {demand.description}
              </Text>
              <View className="flex items-center gap-4 text-xs text-gray-500">
                <Text>性别：{demand.gender}</Text>
                {demand.age_min && demand.age_max && (
                  <Text>月龄：{demand.age_min}-{demand.age_max}月</Text>
                )}
                <Text className="text-orange-500 font-bold">
                  预算：¥{demand.budget_min}-{demand.budget_max}
                </Text>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 报价信息 */}
        <Text className="block text-base font-semibold text-gray-800 mb-3">
          报价信息
        </Text>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            {/* 报价金额 */}
            <View className="mb-4">
              <View className="flex items-center gap-1 mb-2">
                <Text className="text-sm font-medium text-gray-700">报价金额</Text>
                <Text className="text-xs text-red-500">*必填</Text>
              </View>
              <View className="flex items-center gap-2">
                <Text className="text-base text-gray-600">¥</Text>
                <Input
                  type="digit"
                  placeholder="请输入报价金额"
                  value={formData.price}
                  onInput={(e) => setFormData({ ...formData, price: e.detail.value })}
                  className="flex-1"
                />
              </View>
            </View>

            {/* 宠物信息 */}
            <View className="mb-4">
              <View className="flex items-center gap-1 mb-2">
                <Text className="text-sm font-medium text-gray-700">宠物名称</Text>
                <Text className="text-xs text-red-500">*必填</Text>
              </View>
              <Input
                placeholder="例如：小蓝"
                value={formData.pet_name}
                onInput={(e) => setFormData({ ...formData, pet_name: e.detail.value })}
              />
            </View>

            <View className="flex gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2 block">性别</Text>
                <View className="flex gap-2">
                  <Button
                    size="sm"
                    variant={formData.pet_gender === '公' ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, pet_gender: '公' })}
                  >
                    公
                  </Button>
                  <Button
                    size="sm"
                    variant={formData.pet_gender === '母' ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, pet_gender: '母' })}
                  >
                    母
                  </Button>
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2 block">月龄</Text>
                <Input
                  type="number"
                  placeholder="月龄"
                  value={formData.pet_age_months}
                  onInput={(e) => setFormData({ ...formData, pet_age_months: e.detail.value })}
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2 block">花色</Text>
              <Input
                placeholder="例如：纯蓝、蓝白"
                value={formData.pet_color}
                onInput={(e) => setFormData({ ...formData, pet_color: e.detail.value })}
              />
            </View>
          </CardContent>
        </Card>

        {/* 健康信息 */}
        <Text className="block text-base font-semibold text-gray-800 mb-3">
          健康信息
        </Text>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            {/* 疫苗状态 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2 block">疫苗状态</Text>
              <View className="flex gap-2 mb-3">
                <Button
                  size="sm"
                  variant={formData.vaccine_status === '已接种' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, vaccine_status: '已接种' })}
                >
                  已接种
                </Button>
                <Button
                  size="sm"
                  variant={formData.vaccine_status === '未接种' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, vaccine_status: '未接种' })}
                >
                  未接种
                </Button>
              </View>

              {/* 疫苗记录 */}
              {formData.vaccine_status === '已接种' && (
                <View className="bg-gray-50 rounded-lg p-3">
                  <View className="flex items-center justify-between mb-2">
                    <Text className="text-xs text-gray-600">疫苗记录</Text>
                    <Button size="sm" variant="outline" onClick={addVaccineRecord}>
                      + 添加
                    </Button>
                  </View>
                  {vaccineRecords.map((record, index) => (
                    <View key={record.id} className="bg-white rounded-lg p-3 mb-2">
                      <View className="flex items-center justify-between mb-2">
                        <Text className="text-xs text-gray-500">记录 {index + 1}</Text>
                        {vaccineRecords.length > 1 && (
                          <Text 
                            className="text-xs text-red-500"
                            onClick={() => removeVaccineRecord(record.id)}
                          >
                            删除
                          </Text>
                        )}
                      </View>
                      <View className="flex gap-2 mb-2">
                        <Input
                          placeholder="疫苗名称（如：猫三联）"
                          value={record.name}
                          onInput={(e) => updateVaccineRecord(record.id, 'name', e.detail.value)}
                          className="flex-1"
                        />
                        <View className="w-20">
                          <Input
                            type="number"
                            placeholder="针数"
                            value={record.dose.toString()}
                            onInput={(e) => updateVaccineRecord(record.id, 'dose', parseInt(e.detail.value) || 1)}
                          />
                        </View>
                      </View>
                      <Input
                        type="text"
                        placeholder="接种日期（如：2024-01-15）"
                        value={record.date}
                        onInput={(e) => updateVaccineRecord(record.id, 'date', e.detail.value)}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* 驱虫状态 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2 block">驱虫状态</Text>
              <View className="flex gap-2 mb-3">
                <Button
                  size="sm"
                  variant={formData.deworming_status === '已驱虫' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, deworming_status: '已驱虫' })}
                >
                  已驱虫
                </Button>
                <Button
                  size="sm"
                  variant={formData.deworming_status === '未驱虫' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, deworming_status: '未驱虫' })}
                >
                  未驱虫
                </Button>
              </View>

              {/* 驱虫记录 */}
              {formData.deworming_status === '已驱虫' && (
                <View className="bg-gray-50 rounded-lg p-3">
                  <View className="flex items-center justify-between mb-2">
                    <Text className="text-xs text-gray-600">驱虫记录</Text>
                    <Button size="sm" variant="outline" onClick={addDewormingRecord}>
                      + 添加
                    </Button>
                  </View>
                  {dewormingRecords.map((record, index) => (
                    <View key={record.id} className="bg-white rounded-lg p-3 mb-2">
                      <View className="flex items-center justify-between mb-2">
                        <Text className="text-xs text-gray-500">记录 {index + 1}</Text>
                        {dewormingRecords.length > 1 && (
                          <Text 
                            className="text-xs text-red-500"
                            onClick={() => removeDewormingRecord(record.id)}
                          >
                            删除
                          </Text>
                        )}
                      </View>
                      <View className="flex gap-2">
                        <Input
                          placeholder="驱虫类型（如：体内驱虫）"
                          value={record.type}
                          onInput={(e) => updateDewormingRecord(record.id, 'type', e.detail.value)}
                          className="flex-1"
                        />
                        <Input
                          type="text"
                          placeholder="日期"
                          value={record.date}
                          onInput={(e) => updateDewormingRecord(record.id, 'date', e.detail.value)}
                          className="flex-1"
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2 block">健康保障天数</Text>
              <Input
                type="number"
                placeholder="例如：7"
                value={formData.health_guarantee_days}
                onInput={(e) => setFormData({ ...formData, health_guarantee_days: e.detail.value })}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2 block">详细描述</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <Textarea
                  style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent' }}
                  placeholder="请描述宠物健康情况、性格特点等..."
                  value={formData.description}
                  onInput={(e) => setFormData({ ...formData, description: e.detail.value })}
                  maxlength={500}
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 宠物照片 */}
        <Text className="block text-base font-semibold text-gray-800 mb-3">
          宠物照片
        </Text>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <View className="flex items-center gap-1 mb-2">
              <Text className="text-sm font-medium text-gray-700">上传照片</Text>
              <Text className="text-xs text-red-500">*必填（至少1张）</Text>
            </View>
            <View className="flex flex-wrap gap-2">
              {formData.photos.map((_, index) => (
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
                onClick={handleUploadPhoto}
              >
                <Text className="text-2xl text-gray-300">+</Text>
              </View>
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
            {submitting ? '提交中...' : '提交报价'}
          </Text>
        </Button>

        <View className="mb-8">
          <Text className="block text-xs text-gray-400 text-center">
            提交报价后，买家将可以看到您的报价信息并联系您
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

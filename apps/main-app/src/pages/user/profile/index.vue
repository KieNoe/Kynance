<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，{{ userStore.user.name }}
          <span class="regular">
            {{ t(String('pages.user.' + getDatePeriod())) }}
            {{ t('pages.user.markDay1') }} {{ getDiffDays() }} {{ t('pages.user.markDay2') }}</span
          >
        </div>
      </div>
      <t-card class="user-info-list" :title="t('pages.user.personalInfo.title')" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text" @click="handleEditInfo">
            <t-icon name="ellipsis" />
          </t-button>
          <t-dialog
            :visible="dialogVisible"
            :header="t('pages.user.editTitle')"
            width="40%"
            :on-cancel="close"
            :on-esc-keydown="close"
            :on-close-btn-click="close"
            :on-overlay-click="close"
            :cancel-btn="null"
            :confirm-btn="null"
          >
            <t-form
              ref="form"
              :rules="{
                name: [
                  {
                    whitespace: true,
                    message: t('pages.user.personalInfo.validation.nameRequired'),
                  },
                  {
                    min: 3,
                    message: t('pages.user.personalInfo.validation.nameLength'),
                    type: 'error',
                    trigger: 'blur',
                  },
                  {
                    max: 6,
                    message: t('pages.user.personalInfo.validation.nameLength'),
                    type: 'error',
                    trigger: 'blur',
                  },
                ],
                tel: [
                  {
                    validator: (n) => !isNaN(n) && !isNaN(parseFloat(n)),
                    message: t('pages.user.personalInfo.validation.telNumber'),
                  },
                  {
                    len: 11,
                    message: t('pages.user.personalInfo.validation.telLength'),
                  },
                ],
                signature: [
                  {
                    whitespace: true,
                    message: t('pages.user.personalInfo.validation.signatureRequired'),
                  },
                  {
                    min: 3,
                    message: t('pages.user.personalInfo.validation.signatureLength'),
                    type: 'error',
                    trigger: 'blur',
                  },
                  {
                    max: 30,
                    message: t('pages.user.personalInfo.validation.signatureLength'),
                    type: 'error',
                    trigger: 'blur',
                  },
                ],
              }"
              :data="userInfo"
              :color="true"
              @reset="onReset"
              @submit="onSubmit"
            >
              <t-form-item :label="t('pages.user.personalInfo.desc.name')" name="name">
                <t-input v-model="userInfo.name" placeholder="请输入内容"></t-input>
              </t-form-item>
              <t-form-item :label="t('pages.user.personalInfo.desc.telephone')" name="tel">
                <t-input v-model="userInfo.tel" placeholder="请输入内容"></t-input>
              </t-form-item>
              <t-form-item :label="t('pages.user.personalInfo.desc.description')" name="signature">
                <t-input
                  v-model="userInfo.signature"
                  :placeholder="t('pages.user.personalInfo.placeholder.input')"
                ></t-input>
              </t-form-item>
              <t-form-item>
                <t-space size="small">
                  <t-button theme="primary" type="submit">{{
                    t('pages.user.personalInfo.button.submit')
                  }}</t-button>
                  <t-button theme="default" variant="base" type="reset">{{
                    t('pages.user.personalInfo.button.reset')
                  }}</t-button>
                </t-space>
              </t-form-item>
            </t-form>
          </t-dialog>
        </template>
        <t-descriptions :column="4" item-layout="vertical">
          <t-descriptions-item
            v-for="(item, index) in USER_LIST"
            :key="index"
            :label="t(item.title)"
          >
            {{ item.content }}
          </t-descriptions-item>
        </t-descriptions>
      </t-card>
      <t-card class="content-container" :bordered="false">
        <t-card :bordered="false" class="card-padding-no" :title="t('pages.user.recentProfit')">
          <template #actions>
            <t-date-range-picker
              class="card-date-picker-container"
              :default-value="LAST_7_DAYS"
              theme="primary"
              mode="date"
              :value="date"
              @change="onDateChange"
            />
          </template>
          <div class="charts-wrapper" v-for="chart in ['lineChart']" :key="chart">
            <div :id="chart" :ref="chart" style="width: 51.7vw; height: 328px"></div>
          </div>
        </t-card>
      </t-card>
    </t-col>
    <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="80px">K</t-avatar>
        <div class="name">My Account</div>
        <div class="position">{{ t('pages.user.personalInfo.description') }}</div>
      </t-card>
      <t-card :title="t('pages.user.websiteRecommend')" class="user-team" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text" @click="handleEditRecommend">
            <t-icon name="ellipsis" />
          </t-button>
          <t-dialog
            :visible="dialogVisibleRecommend"
            :on-cancel="closeRecommend"
            :on-esc-keydown="closeRecommend"
            :on-close-btn-click="closeRecommend"
            :on-overlay-click="closeRecommend"
            :on-confirm="closeRecommend"
            :header="t('pages.user.mutualEncouragement')"
          >
            <p>{{ t('pages.user.encourage') }}</p>
          </t-dialog>
        </template>
        <t-list :split="false">
          <t-list-item v-for="(item, index) in WEBSITE_RECOMMEND" :key="index">
            <t-icon :name="item.logo" @click="handleNav(item)" style="cursor: pointer" />
            <t-list-item-meta :title="item.title" :description="item.description" />
          </t-list-item>
        </t-list>
      </t-card>
    </t-col>
  </t-row>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

import { useUserStore } from '@/stores'
import { getDiffDays, getDatePeriod } from '@/infrastructure/utils'
import { LAST_7_DAYS } from '@/infrastructure/utils/date'
import { t } from '@/infrastructure/locales'
import { initCharts } from '@/infrastructure/hook'

import { getStockData, getOptions } from './index'
import { USER_INFO_LIST, WEBSITE_RECOMMEND, refreshUserInfoList } from './index'
const userStore = useUserStore()
const dialogVisible = ref(false)
const dialogVisibleRecommend = ref(false)
let USER_LIST = USER_INFO_LIST
const form = ref(null)
const lineChart = ref(null)
const date = ref(LAST_7_DAYS)

const userInfo = reactive({
  name: userStore.user.name,
  tel: userStore.user.telephone,
  signature: userStore.user.description,
})

const handleNav = (item) => {
  window.open('https://' + item.title + '.com')
}

const handleEditInfo = () => {
  dialogVisible.value = true
}

const handleEditRecommend = () => {
  dialogVisibleRecommend.value = true
}

const closeRecommend = () => {
  dialogVisibleRecommend.value = false
}

const close = () => {
  dialogVisible.value = false
}

const onReset = () => {
  userInfo.name = userStore.user.name
  userInfo.tel = userStore.user.telephone
  userInfo.signature = userStore.user.description
}

const onSubmit = ({ validateResult, firstError, e }) => {
  e.preventDefault()
  if (validateResult === true) {
    userStore.setUser('name', userInfo.name)
    userStore.setUser('telephone', userInfo.tel)
    userStore.setUser('description', userInfo.signature)
    USER_LIST = refreshUserInfoList(userStore, t)
    close()
    MessagePlugin.success(t('pages.user.personalInfo.message.success'))
  } else {
    MessagePlugin.warning(firstError)
  }
}

const onDateChange = async (value) => {
  date.value = value
  lineChart.value.setOption(
    Object.assign(lineChart.value.getOption(), getOptions(await getStockData(date.value))),
  )
  MessagePlugin.success(t('pages.user.refreshed'))
}

onMounted(() => {
  nextTick(async () => {
    if (lineChart.value) {
      lineChart.value = (
        await initCharts(
          [{ ref: lineChart }],
          [getOptions(await getStockData(LAST_7_DAYS))],
          onUnmounted,
        )
      )[0].ref
    }
  })
})
</script>
<style scoped>
@import './index.less';

.t-descriptions {
  margin-top: 24px;
}
</style>

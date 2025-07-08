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
            header="编辑个人信息"
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
              :rules="FORM_RULES as any"
              :data="userInfo"
              :color="true"
              @reset="onReset"
              @submit="onSubmit"
            >
              <t-form-item label="昵称" name="name">
                <t-input v-model="userInfo.name" placeholder="请输入内容"></t-input>
              </t-form-item>
              <t-form-item label="手机号码" name="tel">
                <t-input v-model="userInfo.tel" placeholder="请输入内容"></t-input>
              </t-form-item>
              <t-form-item label="个性签名" name="signature">
                <t-input v-model="userInfo.signature" placeholder="请输入内容"></t-input>
              </t-form-item>
              <t-form-item>
                <t-space size="small">
                  <t-button theme="primary" type="submit">提交</t-button>
                  <t-button theme="default" variant="base" type="reset">重置</t-button>
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
            />
          </template>
          <div id="lineContainer" style="width: 75%; height: 328px"></div>
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
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

import { useUserStore } from '@/stores'
import { getDiffDays, getDatePeriod } from '@/infrastructure/utils'
import { LAST_7_DAYS } from '@/infrastructure/utils/date'
import { t } from '@/infrastructure/locales'
import { initChart } from '@/infrastructure/hook'

import { USER_INFO_LIST, WEBSITE_RECOMMEND, PROFIT_OPTION, refreshUserInfoList } from './index'
const userStore = useUserStore()
const dialogVisible = ref(false)
const dialogVisibleRecommend = ref(false)
let USER_LIST = USER_INFO_LIST
const form = ref(null)
let lineChart

const userInfo = reactive({
  name: userStore.user.name,
  tel: userStore.user.telephone,
  signature: userStore.user.description,
})

const FORM_RULES = {
  name: [
    {
      whitespace: true,
      message: '昵称不能为空',
    },
    {
      min: 3,
      message: '输入字数应在3到6之间',
      type: 'error',
      trigger: 'blur',
    },
    {
      max: 6,
      message: '输入字数应在3到6之间',
      type: 'error',
      trigger: 'blur',
    },
  ],
  tel: [
    {
      validator: (n) => !isNaN(n) && !isNaN(parseFloat(n)),
      message: '必须为数字',
    },
    {
      len: 11,
      message: '必须为11位',
    },
  ],
  signature: [
    {
      whitespace: true,
      message: '个性签名不能为空',
    },
    {
      min: 3,
      message: '输入字数应在3到30之间',
      type: 'error',
      trigger: 'blur',
    },
    {
      max: 30,
      message: '输入字数应在3到30之间',
      type: 'error',
      trigger: 'blur',
    },
  ],
}

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
    MessagePlugin.success('编辑成功')
  } else {
    MessagePlugin.warning(firstError)
  }
}

onMounted(() => {
  initChart('lineContainer', lineChart, PROFIT_OPTION, onUnmounted)
})
</script>
<style scoped>
@import './index.less';

.t-descriptions {
  margin-top: 24px;
}
</style>

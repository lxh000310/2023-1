<template>
  <d2-container type="ghost">
    <template #header>
      <h3 class="site-title" v-show="!$store.state.d2admin.fullscreen.active">
        {{ title }}
      </h3>
    </template>

    <div class="wrap d2-mt white">
      <div
        style="position: absolute; top: 0; right: 0; z-index: 1"
        v-if="isMobile"
      >
        <d2-header-fullscreen/>
      </div>
      <el-tabs type="border-card" @tab-click="selectTab" v-model="activeTab">
        <el-tab-pane label="客流数据" name="0">
          <div class="tab-content tab1" v-loading="tab1.loading">
            <div class="section1 section">
              时间：
              <el-date-picker
                size="small"
                :editable="false"
                @change="tab1_pickerChange"
                v-model="tab1.duration"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="tab1.pickerOptions"
                style="z-index: 9;"
              >
              </el-date-picker>
              <el-checkbox
                v-model="tab1.stayMinChecked"
                style="margin-left: 1em;z-index: 9"
              >筛选停留大于{{
                  customizeOption.site.tab1.section1.stayMin.text
                }}的用户
              </el-checkbox
              >
              <el-checkbox v-model="tab1.stayMaxChecked" style="z-index: 9"
              >筛选停留小于{{
                  customizeOption.site.tab1.section1.stayMax.text
                }}的用户
              </el-checkbox
              >
              <el-button
                size="small"
                icon="el-icon-refresh"
                type="primary"
                style="margin-left: 1em;z-index: 9;position: relative"
                @click="tab1_render"
              >查询
              </el-button
              >

              <div class="countInfo">
                <div class="left">
                  <div class="span" style="z-index: 9;">
                    <div>
                      进入客流
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="进入到站点内的客流"
                        placement="top-start"
                      >
                        <span>
                          <i class="el-icon-question icon"></i>
                        </span>
                      </el-tooltip>
                    </div>
                    <i class="num">{{ tab1.stay }}</i>
                  </div>
                  <div class="span" style="z-index: 9;">
                    <div>
                      客流峰值
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="某一时间段进入客流最高值"
                        placement="top-start"
                      >
                        <span>
                          <i class="el-icon-question icon"></i>
                        </span>
                      </el-tooltip>
                    </div>
                    <i class="num">{{ tab1.max }}</i>
                  </div>
                  <div style="position:absolute;right: 1vw">
                    <el-button
                      v-if="
                      customizeOption.site.tab1.section1.downloadingKeyModelsBtn
                        .exist
                    "
                      size="small"
                      icon="el-icon-download"
                      type="primary"
                      style=""
                      @click="tab1_downloadKeyModels"
                      :loading="tab1.downloadingKeyModels"
                    >导出重点车型客流
                    </el-button
                    >
                  </div>
                </div>
                <div class="pie" style="position:absolute;display: flex;top: -40px;justify-content: center;width: 100%">
                  <ve-pie
                    v-if="isMounted"
                    :data="tab1.pieStayData"
                    :resizeable="true"
                    :log="false"
                    :style="{ width: '400px', height: '300px' }"
                    :extend="{
                      series: {
                        radius: ['','30%'],
                    trigger:'item',
                    type: 'pie',
                    label: {
                      show: true,
                      color: '#000',
                    },
                  },
                    }"
                  ></ve-pie>
                  <ve-pie
                    id="pie1"
                    v-if="isMounted"
                    :data="tab1.pieRadiationData"
                    :resizeable="true"
                    :log="false"
                    :style="{ width: '400px', height: '300px' }"
                    :extend="{
                      series: {
                        radius: ['','30%'],
                    trigger:'item',
                    type: 'pie',
                    label: {
                      show: true,
                      color: '#000',
                    },
                  },
                    }"
                  ></ve-pie>
                </div>
                <div class="left">
                  <div class="span" style="z-index: 9;">
                    <div>
                      驻留客流
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="站点内停留3分钟及以上的客流"
                        placement="top-start"
                      >
                        <span>
                          <i class="el-icon-question icon"></i>
                        </span>
                      </el-tooltip>
                    </div>
                    <i class="num">{{ tab1.count }}</i>
                  </div>
                  <div class="span" style="z-index: 9;">
                    <div>
                      辐射客流
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="站点内往外辐射2米的客流"
                        placement="top-start"
                      >
                        <span>
                          <i class="el-icon-question icon"></i>
                        </span>
                      </el-tooltip>
                    </div>
                    <i class="num">{{ tab1.radiation }}</i>
                  </div>
                </div>
              </div>

            </div>

            <div class="section2 section">
              <h4 style="display: flex; justify-content: space-between">
                分区客流
              </h4>
              <div class="onlineState-box">
                <div class="heading">
                  <div class="row1 row"></div>
                  <div class="row2 row">
                    探针状态
                    <el-tooltip
                      class=""
                      effect="dark"
                      content="设备当前的状态，如在线则设备正常接收数据，如离线需要刷新页面，多次刷新仍旧离线则需联系技术人员"
                      placement="top-start"
                    >
                      <span class="state">
                        <i
                          class="el-icon-question icon"
                          style="color: #5ba8fd"
                        ></i>
                      </span>
                    </el-tooltip>
                  </div>
                  <div class="row3 row">
                    客流量
                    <el-tooltip
                      class=""
                      effect="dark"
                      content="每个区域某一时间段的客流总数量"
                      placement="top-start"
                    >
                      <span>
                        <i
                          class="el-icon-question icon"
                          style="color: #5ba8fd"
                        ></i>
                      </span>
                    </el-tooltip>
                  </div>
                </div>

                <div class="box-item-wrap">
                  <div
                    class="box-item"
                    v-for="item in tab1_partitionData"
                    :key="item.name"
                  >
                    <div class="row1 row">{{ item.name }}</div>
                    <div class="row2 row">
                      <span class="state on" v-show="item.state">
                        在线
                        <span class="dot"></span>
                      </span>
                      <span class="state off" v-show="!item.state">
                        离线
                        <span class="dot"></span>
                      </span>
                    </div>
                    <div class="row3 row">{{ item.count }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section3 section">
              <ve-line
                v-if="isMounted"
                :data="tab1.chartData"
                :settings="tab1.chartSettings"
                :resizeable="true"
                :log="false"
                :extend="{
                  xAxis: { boundaryGap: false },
                  series: {
                    type: 'line',
                    label: {
                      show: true,
                      color: '#000',
                    },
                  },
                }"
              ></ve-line>
            </div>

            <div class="section4 section">
              时间：
              <el-date-picker
                :editable="false"
                size="small"
                value-format="yyyy-MM-dd"
                v-model="tab1.date"
                type="date"
                placeholder="选择日期"
                :picker-options="tab1.pickerOptions"
              >
              </el-date-picker>
              <el-button
                size="small"
                icon="el-icon-download"
                type="primary"
                @click="tab1_downloadByDate"
                :loading="tab1.downloadingByDate"
                style="margin-left: 0.5em"
                v-show="customizeOption.configurable"
              >导出单日数据
              </el-button
              >
              <el-button
                size="small"
                icon="el-icon-download"
                type="primary"
                style=""
                @click="tab1_downloadPartitionCount"
                :loading="tab1.downloadingPartitionCount"
              >导出单日分区客流
              </el-button
              >
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane
          lazy
          label="热力图"
          style="padding: 25px"
          v-loading="tab2.loading"
          name="1"
        >
          <el-tabs v-model="tab2.hotmapIndex" class="tab2-header">
            <el-tab-pane label="单日热力图" name="1"></el-tab-pane>
            <el-tab-pane label="总热力图" name="0"></el-tab-pane>
          </el-tabs>
          <div class="tab-content tab2">
            <div
              class="control"
              style="
                display: flex;
                justify-content: flex-end;
                align-items: center;
              "
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  position: fixed;
                  bottom: 1em;
                  right: 3em;
                  z-index: 1;
                  background: #9997;
                  padding-left: 1em;
                "
              >
                <div>调节显示效果：</div>
                <el-slider
                  style="width: 400px; margin-right: 1em"
                  v-model="tab2.hotMapConfig[1].max"
                  :step="1"
                  :min="1"
                  :max="200"
                ></el-slider>
              </div>

              <div v-show="tab2.hotmapIndex === '1'">
                时间：
                <el-date-picker
                  :editable="false"
                  :picker-options="tab1.pickerOptions"
                  size="small"
                  value-format="yyyy-MM-dd"
                  v-model="tab2.date"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </div>
            </div>
            <heatmapjs-vue
              class="heatmap"
              ref="heatmap"
              :max="tab2.hotMapConfig[1].max"
              :min="0"
              :data="hotmapData"
              :style="{
                background: `url(${siteData.heatMapBackground}) center center/100% 100% no-repeat`,
                aspectRatio: 1,
                maxWidth: '1000px',
              }"
              :options="{
                radius: hotMapRadius,
              }"
            ></heatmapjs-vue>
          </div>
        </el-tab-pane>

        <el-tab-pane label="监控" lazy style="padding: 25px" name="2">
          <div class="tab-content tab3">
            <iframe
              v-if="true"
              ref="iframe"
              :src="tab5_getRealSurveillanceVideoUrl().url"
              frameborder="0"
              style="aspect-ratio: 16/9"
            ></iframe>
          </div>
        </el-tab-pane>

        <!--        <el-tab-pane-->
        <!--          v-if="customizeOption.site.tab4.exist"-->
        <!--          label="集客互动"-->
        <!--          lazy-->
        <!--          style="padding: 25px"-->
        <!--          class="tab4-pane"-->
        <!--          name="3"-->
        <!--        >-->
        <!--          <div class="tab-content tab4">-->
        <!--            <el-form :inline="true" class="">-->
        <!--              <el-form-item label="姓名">-->
        <!--                <el-input-->
        <!--                  size="small"-->
        <!--                  placeholder="请输入"-->
        <!--                  class="input"-->
        <!--                  prefix-icon=""-->
        <!--                  v-model="tab4.query.name"-->
        <!--                >-->
        <!--                </el-input>-->
        <!--              </el-form-item>-->
        <!--              <el-form-item label="手机号">-->
        <!--                <el-input-->
        <!--                  size="small"-->
        <!--                  placeholder="请输入"-->
        <!--                  class="input"-->
        <!--                  prefix-icon=""-->
        <!--                  v-model="tab4.query.phone"-->
        <!--                >-->
        <!--                </el-input>-->
        <!--              </el-form-item>-->
        <!--              <el-form-item label="喜欢的车型">-->
        <!--                <el-select-->
        <!--                  clearable-->
        <!--                  size="small"-->
        <!--                  v-model="tab4.query.carType"-->
        <!--                  placeholder="请选择"-->
        <!--                >-->
        <!--                  <el-option-->
        <!--                    v-for="item in tab4.options"-->
        <!--                    :key="item"-->
        <!--                    :label="item"-->
        <!--                    :value="item"-->
        <!--                  >-->
        <!--                  </el-option>-->
        <!--                </el-select>-->
        <!--              </el-form-item>-->

        <!--              <el-form-item>-->
        <!--                <el-button-->
        <!--                  size="small"-->
        <!--                  icon=""-->
        <!--                  type="primary"-->
        <!--                  @click="tab4_getTableDataPage1"-->
        <!--                >查询-->
        <!--                </el-button-->
        <!--                >-->
        <!--                <el-button-->
        <!--                  size="small"-->
        <!--                  icon="el-icon-refresh"-->
        <!--                  plain-->
        <!--                  @click="-->
        <!--                    tab4.query = {};-->
        <!--                    tab4_getTableDataPage1();-->
        <!--                  "-->
        <!--                >重置-->
        <!--                </el-button-->
        <!--                >-->
        <!--                <el-button-->
        <!--                  size="small"-->
        <!--                  icon="el-icon-download"-->
        <!--                  type="primary"-->
        <!--                  @click="tab4_download"-->
        <!--                  :loading="tab4.downloading"-->
        <!--                >导出-->
        <!--                </el-button-->
        <!--                >-->
        <!--              </el-form-item>-->
        <!--            </el-form>-->

        <!--            <el-table-->
        <!--              :data="tab4.tableData"-->
        <!--              v-loading="tab4.loading"-->
        <!--              style="width: 100%"-->
        <!--              ref="xTable"-->
        <!--            >-->
        <!--              <el-table-column prop="name" label="姓名" align="center">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column prop="phone" label="手机号" align="center">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column prop="model" label="喜欢的车型" align="center">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column-->
        <!--                prop="submitTime"-->
        <!--                label="提交时间"-->
        <!--                align="center"-->
        <!--              >-->
        <!--              </el-table-column>-->
        <!--              <el-table-column prop="" label="操作" align="center">-->
        <!--                <template #default="{ row }">-->
        <!--                  <el-button-group>-->
        <!--                    <el-button-->
        <!--                      type="text"-->
        <!--                      @click="-->
        <!--                        tab4_tapEdit({-->
        <!--                          id: row.id,-->
        <!--                          name: row.name,-->
        <!--                          phone: row.phone,-->
        <!--                        })-->
        <!--                      "-->
        <!--                      style="padding: 0 0.5em"-->
        <!--                    >编辑-->
        <!--                    </el-button-->
        <!--                    >-->
        <!--                    <el-button-->
        <!--                      v-show="customizeOption.configurable"-->
        <!--                      type="text"-->
        <!--                      @click="tab4_tapViewPhoto(row.id)"-->
        <!--                      style="padding: 0 0.5em"-->
        <!--                    >查看照片-->
        <!--                    </el-button-->
        <!--                    >-->
        <!--                  </el-button-group>-->
        <!--                </template>-->
        <!--              </el-table-column>-->
        <!--            </el-table>-->
        <!--          </div>-->
        <!--        </el-tab-pane>-->

        <el-tab-pane
          v-if="customizeOption.configurable"
          label="参数配置"
          style="padding: 25px"
          name="4"
        >
          <div class="tab-content tab5">
            <el-form :inline="true" class="">
              <el-form-item label="站名">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model="tab5.name"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="活动时间">
                <el-date-picker
                  size="small"
                  :editable="false"
                  v-model="tab5.duration"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
              <br/>
              <el-form-item label="是否对用户可见">
                <el-switch v-model="tab5.option.index.visible"></el-switch>
              </el-form-item>
              <br/>
              <el-form-item label="摄像头链接">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model="tab5.surveillanceVideo"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="热力图背景图片链接">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model="tab5.heatMapBackground"
                >
                </el-input>
              </el-form-item>
              <br/>

              <!-- <el-form-item label="喜欢的车型">
                <el-select
                  clearable
                  size="small"
                  v-model="tab4.query.carType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in tab4.options"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item> -->

              <div
                style="
                  outline: 2px dashed;
                  padding: 20px 0 0 20px;
                  margin-bottom: 20px;
                  padding-bottom: 20px;
                "
                class="isolation"
              >
                <el-form-item label="单独对某个日期进行特殊设置">
                  <el-date-picker
                    :editable="false"
                    class="tab5-date-picker"
                    :picker-options="{
                      ...tab1.pickerOptions,
                      ...tab5.pickerOptions,
                    }"
                    size="small"
                    value-format="yyyy-MM-dd"
                    v-model="tab5.optionDate"
                    type="date"
                    placeholder="默认全部日期"
                    @change="tab5_changeOptionDate"
                  >
                  </el-date-picker>
                </el-form-item>
                <br/>
                <el-form-item label="A：热力图-minStay(ms)：">
                  <el-input
                    size="small"
                    placeholder="请输入"
                    class="input"
                    prefix-icon=""
                    v-model.trim.number="
                      tab5.option.site.tab2.getHeatMap._minStay
                    "
                  >
                  </el-input>
                </el-form-item>
                <br/>
                <el-form-item label="B：tab1-折线图-假数据：">
                  <el-button
                    size="small"
                    icon=""
                    type="primary"
                    @click="tab5_getRealDailyTab1ChartData"
                  >拿取真实数据
                  </el-button
                  >
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    icon=""
                    type="primary"
                    @click="tab5_stickIntoJsonEditor"
                  >粘入数据
                  </el-button
                  >
                </el-form-item>
                <div
                  class="json-editor"
                  ref="json-editor"
                  style="margin-top: -1em; padding-right: 20px"
                ></div>
              </div>
              <el-form-item label="客流-stayMin(s):">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim.number="
                    tab5.option.site.tab1.section1.stayMin.value
                  "
                >
                </el-input>
              </el-form-item>
              <el-form-item label="客流-stayMin文本:">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim="tab5.option.site.tab1.section1.stayMin.text"
                >
                </el-input>
              </el-form-item>
              <br/>
              <el-form-item label="客流-stayMax(s):">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim.number="
                    tab5.option.site.tab1.section1.stayMax.value
                  "
                >
                </el-input>
              </el-form-item>
              <el-form-item label="客流-stayMax文本:">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim="tab5.option.site.tab1.section1.stayMax.text"
                >
                </el-input>
              </el-form-item>
              <br/>
              <el-form-item label="导出整站-stayMin(s):">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim.number="
                    tab5.option.index.downloadMobileBySite.stayMin
                  "
                >
                </el-input>
              </el-form-item>
              <el-form-item label="导出整站-stayMax(s):">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim.number="
                    tab5.option.index.downloadMobileBySite.stayMax
                  "
                >
                </el-input>
              </el-form-item>
              <br/>
              <el-form-item label="导出重点车型-minStay(ms):">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim.number="
                    tab5.option.site.tab1.section1.downloadingKeyModelsBtn
                      .minStay
                  "
                >
                </el-input>
              </el-form-item>
              <br/>
              <el-form-item label="分区人数-minStay(ms):">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim.number="
                    tab5.option.site.tab1.section2.getPartitionCount.minStay
                  "
                >
                </el-input>
              </el-form-item>
              <br/>
              <el-form-item label="导出单日数据-stayMin(s):">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim.number="
                    tab5.option.site.tab1.section4.downloadMobile.stayMin
                  "
                >
                </el-input>
              </el-form-item>
              <el-form-item label="导出单日数据-stayMax(s):">
                <el-input
                  size="small"
                  placeholder="请输入"
                  class="input"
                  prefix-icon=""
                  v-model.trim.number="
                    tab5.option.site.tab1.section4.downloadMobile.stayMax
                  "
                >
                </el-input>
              </el-form-item>
              <br/>
              <el-form-item>
                <el-button
                  size="small"
                  icon=""
                  type="primary"
                  @click="tab5_setConfig"
                >确认更改
                </el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- <h1 style="text-align: center;font-weight: normal;">{{ $route.params }}</h1> -->
    </div>
    <template #footer v-if="activeTab === '3'">
      <vxe-pager
        align="right"
        size="small"
        :current-page.sync="tab4.pageinfo.currentPage"
        :page-size.sync="tab4.pageinfo.pageSize"
        :total="tab4.pageinfo.totalResult"
        @page-change="tab4_handlePageChange"
      >
      </vxe-pager>
    </template>

    <!-- 弹出框 -->
    <!-- 1.编辑弹窗 -->
    <el-dialog
      title="编辑"
      :visible.sync="tab4.updateDialog.visible"
      width="500px"
    >
      <el-form>
        <el-form-item label="姓名：" :label-width="'6em'">
          <el-input
            v-model.trim="tab4.updateDialog.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="'6em'">
          <el-input
            v-model.trim="tab4.updateDialog.phone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tab4.updateDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="tab4_update">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 2.查看照片弹窗 -->
    <el-dialog
      title="查看照片"
      :visible.sync="tab4.pictureDialog.visible"
      class="pictureDialog"
    >
      <div class="list-wrap">
        <div class="list">
          <img
            v-for="(src, index) in tab4.pictureDialog.srcArr"
            :key="index"
            :src="src"
            class="list-item"
            @click="
              tab4.pictureDialog.inner.src = src;
              tab4.pictureDialog.inner.visible = true;
            "
          />
        </div>
      </div>

      <!-- 内层弹窗照片预览 -->
      <el-dialog
        class="pictureInnerDialog"
        width="70vmin"
        title=""
        :visible.sync="tab4.pictureDialog.inner.visible"
        append-to-body
      >
        <img :src="tab4.pictureDialog.inner.src" class="preview"/>
      </el-dialog>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="tab4.updateDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="tab4_update">确 定</el-button>
      </div> -->
    </el-dialog>
  </d2-container>
</template>
<script>
import * as APIs from "@/api/groupedApi";
// window.APIs = APIs; // 调试
import * as Utils from "@/utils";
import FileInputImg from "@/components/file-input-img";
import * as hotMapData from "./hotMapData";
import d2HeaderFullscreen from "@/layout/header-aside/components/header-fullscreen";
import customizeOption, {checkParam, getRealSurveillanceVideoUrl, parse, recover, stringify} from "@/customize.js";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";

Object.assign(window, {stringify, parse, JSONEditor, recover}); // 调试

export default {
  name: "site",
  props: {
    siteId: Number,
  },
  components: {
    FileInputImg,
    d2HeaderFullscreen,
  },
  data() {
    console.log("site-this", this);
    return {
      customizeOption,
      isMobile: window.outerWidth < 1000,
      activeTab: "0",
      isMounted: false, // mount状态的响应式数据
      siteData: {}, // 记录站点所有配置信息

      tab1: {
        loading: false,
        downloadingKeyModels: false,
        downloadingPartitionCount: false,
        downloadingByDate: false,
        timer: null, // 不断拿设备在线状态
        timerDuration: 30, // 拿取间隔（s）
        defaultStartTime: "08:00:00",
        defaultEndTime: "18:00:00",
        count: 0,
        count1: 0,
        max: 0,
        stay: 0,
        stay1: 0,
        radiation: 0,
        radiation1: 0,
        duration: [new Date(), new Date()],
        stayMinChecked: true,
        stayMaxChecked: true,
        pickerOptions: {
          /* shortcuts: [
            {
              text: "最近十天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 10);
                picker.$emit("pick", [start, end]);
              },
            },
          ], */
          disabledDate: (date) => {
            // console.log(date);
            const {begin, deadline} = this.siteData;
            if (+date >= +new Date(begin) && +date <= +new Date(deadline)) {
              return false;
            } else {
              return true;
            }
          },
        },
        chartData:
          {
            columns: ["时间", "进入客流"],
            rows: [
              {时间: "9点", 进入客流: 20},
              {时间: "10点", 进入客流: 300},
              {时间: "11点", 进入客流: 900},
            ],
          } && {},
        chartSettings: {
          // yAxisName: ["title1", "title2"],
          xAxisType: "category",
          area: true,
        },
        pieStayData: {
          columns: ['名称', '人数'],
          rows: [
            {'名称': '驻留客流', '人数': 0},
            {'名称': '进入客流', '人数': 0},
          ]
        },

        pieRadiationData: {
          columns: ['名称', '人数'],
          rows: [
            {'名称': '辐射客流', '人数': 0},
            {'名称': '进入客流', '人数': 0},
          ]
        },


        date: this.formatDate(new Date()), // 导出日期

        partitionCountObj: {}, // 分区人数对象{分区id： 人数}
        partitionConfigArr: [], // 此站点的分区配置信息[{id, name, xbegin, xdeadline, ybegin, ydeadline}]
        ownedDeviceArr: [], // 此站点拥有的设备
        deviceStateObj: {}, // 所有设备的在线状态 {设备id： 设备上次传数据的时间}
      },
      tab2: {
        loading: false,
        hotmap0: [
          {x: 50, y: 50, value: 75},
          {x: -0 + 10, y: -50, value: 75},
          {x: -0 - 10, y: -50, value: 75},
        ],
        hotmap1: hotMapData.default, // 后端真实数据
        hotmap2: hotMapData.fakeRandomData,
        hotmap3: [
          ...Array(1000)
            .fill(true)
            .map(() => ({
              x: Math.random(),
              y: Math.random(),
              value: Math.random() * 40,
            })),
        ],
        hotmapTotal: [],
        hotmapSingle: [],
        /**
         * 总热力图 0
         * 单日热力图 1
         */
        hotmapIndex: "1",
        date: this.formatDate(new Date()), // 单日热力图日期
        hotMapConfig: [
          // 第一个配置没有用到
          {
            max: 10,
            min: 1,
          },
          {
            max: 50,
            min: 1,
            radius: 40,
          },
        ],
      },
      tab4: {
        downloading: false,
        loading: false,
        options: [
          "全新RX5 eMAX",
          "鲸",
          "全新RX5 MAX",
          "全新RX5 ePLUS",
          "全新RX5 PLUS",
          "荣威iMAX8",
          "荣威RX5 eMAX",
          "荣威RX5 ePLUS",
          "荣威i6 MAX",
          "全新i5",
          "荣威RX8",
          "荣威ei6 MAX",
          "荣威i6 MAX EV",
          "荣威RX5",
          "荣威RX3 PRO",
          "荣威Ei5",
          "科莱威CLEVER",
        ],
        query: {
          name: null,
          phone: null,
          carType: null,
        },
        tableData: [],
        pageinfo: {
          currentPage: 1,
          pageSize: 10,
          totalResult: 0,
        },
        updateDialog: {
          visible: false,
          id: null,
          name: null,
          phone: null,
        },
        pictureDialog: {
          visible: false,
          inner: {
            visible: false,
            src: "",
          },
          srcArr: [
            "https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF",
            "https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF",
            "https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF",
          ],
        },
      },
      tab5: {
        name: "",
        duration: [this.formatDate(new Date()), this.formatDate(new Date())],
        surveillanceVideo: "",
        heatMapBackground: "",
        optionDate: null,
        pickerOptions: {
          cellClassName: (date) => {
            const special1 = Object.keys(
              this.customizeOption.site.tab2.getHeatMap.minStay.specifics
            ).includes(this.formatDate(date));
            const special2 = Object.keys(
              this.customizeOption.site.tab1.section3.fakeDailyTab1ChartData
                .specifics
            ).includes(this.formatDate(date));
            const special = special1 || special2;
            return `${special ? "special" : ""}${special1 ? " special1" : ""}${
              special2 ? " special2" : ""
            }`;
          },
        },
        jsonEditor: null,
        option: {
          // 可线上修改的自定义配置
          index: {
            downloadMobileBySite: {
              stayMin: null,
              stayMax: null,
            },
            visible: true,
          },
          site: {
            tab1: {
              section1: {
                downloadingKeyModelsBtn: {
                  minStay: null,
                },
                stayMin: {
                  value: null,
                  text: null,
                },
                stayMax: {
                  value: null,
                  text: null,
                },
              },
              section2: {
                getPartitionCount: {
                  minStay: null,
                },
              },
              section3: {
                _fakeDailyTab1ChartData: undefined,
              },
              section4: {
                downloadMobile: {
                  stayMin: null,
                  stayMax: null,
                },
              },
            },
            tab2: {
              getHeatMap: {
                minStay: null, // 实际没有用到
                _minStay: null, // 用来双向绑定
              },
            },
          },
        },
      },
    };
  },
  computed: {
    title() {
      // 字符串：站点名+开始结束时间
      if (!("name" in this.siteData)) {
        return;
      }
      const {name, begin, deadline} = this.siteData;

      function formate(str) {
        return new Date(str)
          .toLocaleDateString()
          .replace(/^(\d+)\/(\d+)\/(\d+)/, (...args) => {
            // console.log(args);
            return args[2] + "月" + args[3] + "日";
          });
      }

      return `${name}（${formate(begin)}-${formate(deadline)}）`;
    },
    siteOffsetData() {
      // console.log("-------get-site-offset-------");
      // 记录站点场地尺寸信息
      let {heatMapXCoordinateRange, heatMapYCoordinateRange} = this.siteData;
      heatMapXCoordinateRange = JSON.parse(heatMapXCoordinateRange);
      heatMapYCoordinateRange = JSON.parse(heatMapYCoordinateRange);
      const widthRange = [
        heatMapXCoordinateRange.start,
        heatMapXCoordinateRange.end,
      ];
      const heightRange = [
        heatMapYCoordinateRange.start,
        heatMapYCoordinateRange.end,
      ];
      const ratio =
        (widthRange[1] - widthRange[0]) / (heightRange[1] - heightRange[0]);
      return {
        widthRange, // [-100, 100]
        heightRange, // [-100, 100]
        ratio, // 1
      };
    },
    hotmapData: {
      // 这个属性存储和返回的都是从后端拿来的原始数据
      get() {
        const index = this.tab2.hotmapIndex;
        if (index === "0") {
          return this.tab2.hotmapTotal;
        } else if (index === "1") {
          return this.tab2.hotmapSingle;
        } else {
          throw "index error";
        }
      },
      set(newVal) {
        const index = this.tab2.hotmapIndex;
        if (index === "0") {
          // 更新总热力图数据
          this.tab2.hotmapTotal = newVal;
        } else if (index === "1") {
          // 更新单日热力图数据
          this.tab2.hotmapSingle = newVal;
        }
      },
    },
    tab1_partitionData() {
      const fake = false; // TODO: 调试 - 返回假数据给计算属性（分区信息）
      if (fake) {
        // 假信息
        return [1, 2, 3, 4, 5, 6].map((item) => ({
          name: "区" + item,
          state: !!(item % 2),
          count: item * 100,
        }));
      } else if (
        // true ||
        Object.keys(this.tab1.partitionCountObj).length === 0 ||
        this.tab1.partitionConfigArr.length === 0 ||
        this.tab1.ownedDeviceArr.length === 0 ||
        Object.keys(this.tab1.deviceStateObj).length === 0
      ) {
        // 依赖的响应式数据未全部拿到，就先返回空
        console.log("依赖的响应式数据未全部拿到，就先返回空");
        return [];
      } else {
        console.log("依赖的响应式数据已全部拿到，开始计算");
        let resultArr = Object.entries(this.tab1.partitionCountObj);
        console.log("resultArr:before", resultArr);
        resultArr = resultArr.map((itemArr) => {
          const [id, count] = itemArr;
          // 此区域信息
          const configItem = this.tab1.partitionConfigArr.find(
            (item) => item.id === +id
          );
          console.log("configItem", configItem);
          if (!configItem) {
            return null; // 未找到分区配置信息，返回空，随后需过滤
          }
          const {name, xbegin, xdeadline, ybegin, ydeadline} = configItem;

          // 此区域对应的设备信息
          const deviceItem = this.tab1.ownedDeviceArr.find((device) => {
            const {deviceXCoordinate, deviceYCoordinate} = device;
            return (
              deviceXCoordinate >= xbegin &&
              deviceXCoordinate <= xdeadline &&
              deviceYCoordinate >= ybegin &&
              deviceYCoordinate <= ydeadline
            );
          });
          console.log("deviceItem", deviceItem);
          if (!deviceItem) {
            return null; // 未找到此区域对应的设备，返回空，随后需过滤
          }

          console.log("====state====");
          const {deviceId} = deviceItem;
          // 根据设备id，换设备在线状态
          let state = false;
          const deviceDate = this.tab1.deviceStateObj[deviceId];
          console.log("deviceDate", deviceDate);
          if (deviceDate) {
            const time = Date.now() - new Date(+deviceDate);
            console.log("time", time);
            if (time > 1000 * 60 * 3) {
              state = false;
            } else {
              state = true;
            }
          }
          return {name, state, count};
        });
        console.log("resultArr", resultArr);
        resultArr = resultArr.filter((item) => item); // 过滤非真项
        return resultArr;
      }
    },
    hotMapRadius() {
      // return 133;
      if (Object.keys(this.siteData).length === 0) {
        // 没拿到站点数据，返回默认的
        return 41;
      } else {
        return Math.floor(
          (1000 * 2) /
          (this.siteOffsetData.widthRange[1] -
            this.siteOffsetData.widthRange[0])
        );
      }
    },
  },
  watch: {
    "tab2.hotmapIndex"(newVal) {
      // console.log("newVal", newVal);
      this.tab2_render();
    },
    "tab2.date"() {
      this.tab2_render();
    },
    "tab5.option.site.tab1.section3._fakeDailyTab1ChartData"(newVal) {
      this.tab5_updateJsonEditor(newVal);
    },
  },
  // 方法集合
  methods: {
    selectTab(instance) {
      // const { index } = instance;
      const index = this.activeTab;
      console.log("tab", index);
      if (index === "0") {
        this.tab1_render();
      } else if (index === "1") {
        Promise.resolve().then(() => {
          this.resetTab2Ratio(); // 设置热力图和监控iframe的宽高比
          this.tab2_render();
        });
      } else if (index === "2") {
        this.resetTab2Ratio(); // 设置热力图和监控iframe的宽高比
      } else if (index === "3") {
        this.tab4_getTableDataPage1();
      } else if (index === "4") {
        this.tab5_getConfig();
      }
    },
    getSiteData() {
      return APIs.Site_page({
        id: this.$route.params.siteId,
      }).then((res) => {
        if (res.code === 0) {
          this.siteData = {
            ...res.data.list[0],
            surveillanceVideo: unescape(res.data.list[0].surveillanceVideo),
            heatMapBackground: unescape(res.data.list[0].heatMapBackground),
          };
        } else {
          this.$message.error(res.msg);
          throw res.msg;
        }
      });
    },
    async resetTab2Ratio() {
      console.log("reset-ratio");
      await 1;
      const dom1 = this.$refs.heatmap.$el;
      dom1.style.height = dom1.offsetWidth / this.siteOffsetData.ratio + "px"; //height和ratio同时使用，为了兼容移动端
      dom1.style.aspectRatio = this.siteOffsetData.ratio;
      console.log("dom1.width", dom1.offsetWidth * 1 + "px");
      // alert(dom1.offsetWidth);
      const dom2 = this.$refs.iframe;
      dom2 && (dom2.style.height = (dom2.offsetWidth * 9) / 16 + "px");
      // alert((dom2.offsetWidth * 9) / 16 + "px");
      // dom2.style.aspectRatio = "16 / 9";
    },

    // tab1
    formatDate(date) {
      const arr = date
        .toLocaleDateString()
        .split("/")
        .map((str) => {
          if (str.length === 1) {
            return "0" + str;
          } else {
            return str;
          }
        });
      return arr.join("-");
    },
    formateTimeDeadline(date) {
      console.log("deadlineTime", date);
      // 返回特定的截止时间字符串
      // 1. date和现在的日期一致返回现在的时间
      // 2. 不一致则返回默认的活动结束时间
      if (this.formatDate(date) === this.formatDate(new Date())) {
        let hh = new Date().getHours();
        let mm = new Date().getMinutes();
        let ss = new Date().getSeconds();
        hh = hh > 9 ? hh + "" : "0" + hh;
        mm = mm > 9 ? mm + "" : "0" + mm;
        ss = ss > 9 ? ss + "" : "0" + ss;
        return `${hh}:${mm}:${ss}`;
      } else {
        return this.tab1.defaultEndTime;
      }
    },
    tab1_pickerChange(e) {
      // this.tab1_render();
    },
    tab1_render(x) {
      console.log("--------tab1-render--------");
      let begin, deadline; // 日期字符串
      if (!this.tab1.duration) {
        begin = deadline = this.formatDate(new Date());
      } else {
        [begin, deadline] = this.tab1.duration.map((date) =>
          this.formatDate(date)
        );
      }
      this.tab1.loading = true;

      if (begin !== deadline) {
        //驻留客流
        APIs.ActiveData_getStatisticsByData({
          siteId: this.$route.params.siteId,
          begin,
          deadline,
          stayMin: this.tab1.stayMinChecked ? this.customizeOption.site.tab1.section1.stayMin.value : 0,
          stayMax: this.tab1.stayMaxChecked ? this.customizeOption.site.tab1.section1.stayMax.value : 3600 * 10,
        })
          .then((res) => {
            if (res.code === 0) {
              // 渲染两个数据
              const {count, max} = res.data;
              this.tab1.pieStayData.rows[0]['人数'] = res.data.count
              Object.assign(this.tab1, {
                count,
                max,
              });
              // begin、deadline若不等，则渲染多日数据到折线图
              const columns = ["日期", "驻留客流"];
              const map = new Map(Object.entries(res.data.statisticMap)); // FIXME:order
              // console.log('map', map);
              const chartData = {
                columns,
                // rows: [
                //   { 时间: "9点", 进入客流: 20 },
                //   { 时间: "10点", 进入客流: 300 },
                //   { 时间: "11点", 进入客流: 900 }
                // ],
                rows: [...map.entries()].map((arr) => ({
                  [columns[0]]: arr[0],
                  [columns[1]]: arr[1],
                })),
              };
              // console.log('chartData', chartData);
              Object.assign(this.tab1, {chartData});

            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.tab1.loading = false;
          });
        //进入客流
        APIs.ActiveData_getStayStatisticsByData({
          siteId: this.$route.params.siteId,
          begin,
          deadline,
          stayMin: 60,
          stayMax: 300,
        })
          .then((res) => {
            if (res.code === 0) {
              // 渲染两个数据
              const stay = res.data.count;
              this.tab1.pieStayData.rows[1]['人数'] = res.data.count;
              this.tab1.pieRadiationData.rows[1]['人数'] = res.data.count;
              Object.assign(this.tab1, {
                stay,
              });
              // begin、deadline若不等，则渲染多日数据到折线图
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.tab1.loading = false;
          });
        //辐射客流
        APIs.ActiveData_getOutsideStatisticsByDate({
          siteId: this.$route.params.siteId,
          begin,
          deadline,
          distance: 2
        })
          .then((res) => {
            if (res.code === 0) {
              // 渲染两个数据
              const radiation = Math.ceil((res.data.count - 0) / 3);
              this.tab1.pieRadiationData.rows[0]['人数'] = Math.ceil((res.data.count - 0) / 3);
              Object.assign(this.tab1, {
                radiation,
              });
              // begin、deadline若不等，则渲染多日数据到折线图
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.tab1.loading = false;
          });
      }

      // begin、deadline若相等，则渲染单日数据到折线图
      if (begin === deadline) {
        //单日驻留客流
        APIs.ActiveData_getStatisticsByTime({
          siteId: this.$route.params.siteId,
          date: begin,
          begin: this.tab1.defaultStartTime,
          deadline: this.formateTimeDeadline(new Date(begin)),
          stayMin: this.tab1.stayMinChecked ? this.customizeOption.site.tab1.section1.stayMin.value : 0,
          stayMax: this.tab1.stayMaxChecked ? 3600 : 3600 * 10,
        })
          .then((res) => {
            if (res.code === 0) {
              this.tab1.pieStayData.rows[0]['人数'] = res.data.count
              // 渲染折线图
              const columns = ["时间", "驻留客流"];
              // FIXME:order
              const chartData = {
                columns,
                // rows: [
                //   { 时间: "9点", 进入客流: 20 },
                //   { 时间: "10点", 进入客流: 300 },
                //   { 时间: "11点", 进入客流: 900 }
                // ],
                rows: Object.entries(res.data.statisticMap).map((arr) => ({
                  [columns[0]]: arr[0],
                  [columns[1]]: arr[1],
                })),
              };
              const fakeChartData =
                this.customizeOption.site.tab1.section3.fakeDailyTab1ChartData_get(
                  begin
                );
              console.log("fakeChartData", fakeChartData);
              // 配置中有当天的假数据则渲染假数据
              Object.assign(this.tab1, {
                chartData: fakeChartData || chartData,
              });
              // 渲染两个数据
              const {count, max} = res.data;
              const fakeCountArr = fakeChartData
                ? fakeChartData.rows.map((item) => item[columns[1]])
                : null;
              Object.assign(
                this.tab1,
                fakeCountArr
                  ? {
                    count: fakeCountArr.reduce((a, b) => a + b),
                    max: Math.max(...fakeCountArr),
                  }
                  : {count, max}
              );
              // 渲染的同时放入tab5的json-editor中，对应tab5拿取真实数据按钮
              this.tab5.option.site.tab1.section3._fakeDailyTab1ChartData =
                chartData;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.tab1.loading = false;
          });
        //单日进入客流
        APIs.ActiveData_getStatisticsByTime({
          siteId: this.$route.params.siteId,
          date: begin,
          begin: this.tab1.defaultStartTime,
          deadline: this.formateTimeDeadline(new Date(begin)),
          stayMin: 60,
          stayMax: 28800,
        })
          .then((res) => {
            if (res.code === 0) {
              this.tab1.pieStayData.rows[1]['人数'] = res.data.count;
              this.tab1.pieRadiationData.rows[1]['人数'] = res.data.count;
              // 渲染两个数据
              const stay = res.data.count;
              Object.assign(this.tab1, {
                stay,
              });
              // begin、deadline若不等，则渲染多日数据到折线图
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.tab1.loading = false;
          });
        //单日辐射客流
        APIs.ActiveData_getOutsideStatisticsByTime({
          siteId: this.$route.params.siteId,
          date: begin,
          begin: this.tab1.defaultStartTime,
          deadline: this.formateTimeDeadline(new Date(begin)),
          distance: 2
        })
          .then((res) => {
            if (res.code === 0) {
              // 渲染两个数据
              this.tab1.pieRadiationData.rows[0]['人数'] = Math.ceil((res.data.count - 0) / 3)
              const radiation = Math.ceil((res.data.count - 0) / 3);
              Object.assign(this.tab1, {
                radiation,
              });
              // begin、deadline若不等，则渲染多日数据到折线图
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.tab1.loading = false;
          });
      }


      // 渲染分区客流数据
      this.tab1_renderPartition({begin, deadline}).then(
        (res) => {
          this.tab1.loading = false;
        },
        (err) => {
          this.tab1.loading = false;
        }
      );
    },
    async tab1_renderPartition({begin, deadline}) {
      // 去拿分区人数对象
      await APIs.ActiveData_getPartitionCount({
        siteId: this.$route.params.siteId,
        type: this.siteData.partitionType,
        begin,
        deadline,
        minStay:
          begin === deadline &&
          begin === "2022-05-29" &&
          customizeOption.customizeIndex === 0
            ? 0
            : customizeOption.site.tab1.section2.getPartitionCount.minStay,
      }).then((res) => {
        console.log("partition", res);
        if (res.code !== 0) {
          this.$message.error(res.msg);
          throw res.msg;
        } else {
          this.tab1.partitionCountObj = res.data;
          // return res.data;
        }
      });
      // 去拿此站点的分区信息
      await APIs.Partition_list({
        type: this.siteData.partitionType,
      }).then((res) => {
        if (res.code !== 0) {
          this.$message.error(res.msg);
          throw res.msg;
        } else {
          this.tab1.partitionConfigArr = res.data;
          // return res.data;
        }
      });
      // 去拿此站点拥有的设备
      await APIs.Site_listSiteDevices({
        id: this.$route.params.siteId,
      }).then((res) => {
        if (res.code !== 0) {
          this.$message.error(res.msg);
          throw res.msg;
        } else {
          this.tab1.ownedDeviceArr = res.data;
        }
      });
      // 去拿所有设备的在线状态
      this.tab1_getDeviceStateObj();
    },
    tab1_getDeviceStateObj() {
      // 去拿所有设备的在线状态
      APIs.Site_getDevices().then((res) => {
        if (res.code !== 0) {
          this.$message.error(res.msg);
          throw res.msg;
        } else {
          this.tab1.deviceStateObj = res.data;
        }
      });
    },
    startTab1Timer() {
      this.endTab1Timer();
      this.tab1.timer = setInterval(() => {
        if (this.activeTab !== "0") {
          return;
        }
        this.tab1_getDeviceStateObj();
      }, this.tab1.timerDuration * 1000);
    },
    endTab1Timer() {
      clearInterval(this.tab1.timer);
    },
    async tab1_downloadByDate() {
      this.tab1.downloadingByDate = true;
      let notify1 = {
        close() {
        }
      };
      Utils.setTimeoutPro(1000).then(() => {
        // 还没下载好，弹出notify
        const loading = this.tab1.downloadingByDate;
        if (loading) {
          notify1 = this.$notify({
            title: "导出文件准备中",
            message: "准备工作会在后台进行，你可以选择进行其他操作",
            duration: 0,
          });
        }
      });
      const res = await APIs.ActiveData_downloadMobile({
        siteId: this.$route.params.siteId,
        date: this.tab1.date || this.formatDate(new Date()),
        stayMin: customizeOption.site.tab1.section4.downloadMobile.stayMin,
        stayMax: customizeOption.site.tab1.section4.downloadMobile.stayMax,
      }).finally(() => {
        this.tab1.downloadingByDate = false;
        notify1.close();
      });
      console.log(7, res);
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      }); // 转化为blob对象
      let filename = new Date().toLocaleString() + "数据.xls"; // 判断是否使用默认文件名
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
        const tempLink = document.createElement("a"); // 创建一个a标签
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename); // 给a标签添加下载属性
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink); // 将a标签添加到body当中
        tempLink.click(); // 启动下载
        document.body.removeChild(tempLink); // 下载完毕删除a标签
        window.URL.revokeObjectURL(blobURL);
      }
    },
    async tab1_downloadKeyModels() {
      let begin, deadline; // 日期字符串
      if (!this.tab1.duration) {
        begin = deadline = this.formatDate(new Date());
      } else {
        [begin, deadline] = this.tab1.duration.map((date) =>
          this.formatDate(date)
        );
      }
      this.tab1.downloadingKeyModels = true;
      let notify1 = {
        close() {
        }
      };
      Utils.setTimeoutPro(1000).then(() => {
        // 还没下载好，弹出notify
        const loading = this.tab1.downloadingKeyModels;
        if (loading) {
          notify1 = this.$notify({
            title: "导出文件准备中",
            message: "准备工作会在后台进行，你可以选择进行其他操作",
            duration: 0,
          });
        }
      });
      const res = await APIs.ActiveData_downloadKeyModels({
        siteId: this.$route.params.siteId,
        type: this.siteData.keyModelsType,
        begin,
        deadline,
        minStay:
          begin === deadline &&
          begin === "2022-05-29" &&
          customizeOption.customizeIndex === 0
            ? 0
            : customizeOption.site.tab1.section1.downloadingKeyModelsBtn
              .minStay,
      }).finally(() => {
        this.tab1.downloadingKeyModels = false;
        notify1.close();
      });
      console.log(7, res);
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      }); // 转化为blob对象
      let filename = new Date().toLocaleString() + "数据.xls"; // 判断是否使用默认文件名
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
        const tempLink = document.createElement("a"); // 创建一个a标签
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename); // 给a标签添加下载属性
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink); // 将a标签添加到body当中
        tempLink.click(); // 启动下载
        document.body.removeChild(tempLink); // 下载完毕删除a标签
        window.URL.revokeObjectURL(blobURL);
      }
    },
    async tab1_downloadPartitionCount() {
      this.tab1.downloadingPartitionCount = true;
      let notify1 = {
        close() {
        }
      };
      Utils.setTimeoutPro(1000).then(() => {
        // 还没下载好，弹出notify
        const loading = this.tab1.downloadingPartitionCount;
        if (loading) {
          notify1 = this.$notify({
            title: "导出文件准备中",
            message: "准备工作会在后台进行，你可以选择进行其他操作",
            duration: 0,
          });
        }
      });
      const res = await APIs.ActiveData_downloadPartitionCount({
        siteId: this.$route.params.siteId,
        type: this.siteData.keyModelsType,
        date: this.tab1.date || this.formatDate(new Date()),
        minStay:
          this.tab1.date === "2022-05-29" &&
          customizeOption.customizeIndex === 0
            ? 0
            : customizeOption.site.tab1.section2.getPartitionCount.minStay,
      }).finally(() => {
        this.tab1.downloadingPartitionCount = false;
        notify1.close();
      });
      console.log(7, res);
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      }); // 转化为blob对象
      let filename = new Date().toLocaleString() + "数据.xls"; // 判断是否使用默认文件名
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
        const tempLink = document.createElement("a"); // 创建一个a标签
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename); // 给a标签添加下载属性
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink); // 将a标签添加到body当中
        tempLink.click(); // 启动下载
        document.body.removeChild(tempLink); // 下载完毕删除a标签
        window.URL.revokeObjectURL(blobURL);
      }
    },

    // tab2
    formatHotmapData(arr) {
      // 将坐标信息（后台原始数据）转换为绘图需要的offset形式
      return arr.map((item) => {
        const {xcoordinate: x, ycoordinate: y, count: value} = item;
        const {offsetWidth, offsetHeight} = this.$refs.heatmap.$el;
        const {widthRange, heightRange} = this.siteOffsetData;
        const percentX = (x - widthRange[0]) / (widthRange[1] - widthRange[0]);
        const percentY =
          1 - (y - heightRange[0]) / (heightRange[1] - heightRange[0]);
        return {
          x: Math.round(offsetWidth * percentX),
          y: Math.round(offsetHeight * percentY),
          value,
        };
      });
    },
    getHeatMapData(date = null) {
      if (date) {
        // 单日热力图
        this.tab2.loading = true;
        return APIs.ActiveData_getHeatMap({
          siteId: this.$route.params.siteId,
          date,
          minStay:
          /* date === "2022-05-29" && customizeOption.customizeIndex === 0
            ? 0
            : this.customizeOption.site.tab2.getHeatMap.minStay, */
            this.customizeOption.site.tab2.getHeatMap.minStay_get(date) ===
            undefined
              ? this.customizeOption.site.tab2.getHeatMap.minStay_get()
              : this.customizeOption.site.tab2.getHeatMap.minStay_get(date),
        })
          .then((res) => {
            if (res.code === 0) {
              this.hotmapData = this.formatHotmapData(res.data);
            } else {
              this.$message.error(res.msg);
              throw res.msg;
            }
          })
          .then(
            (res) => {
              this.tab2.loading = false;
            },
            (err) => {
              this.tab2.loading = false;
            }
          );
      } else {
        // 总热力图
        this.tab2.loading = true;
        let {begin: activeBegin} = this.siteData;
        activeBegin = +new Date(activeBegin);
        const now = +new Date();
        // console.log('activeBegin', activeBegin);
        // console.log('now', now);
        if (+now <= +activeBegin) {
          // 活动未开始
          return;
        } else {
          let dateArr = [];
          let temp = activeBegin;
          while (temp <= now) {
            dateArr.push(temp);
            temp += 24 * 3600 * 1000;
          }
          dateArr = dateArr.map((num) => this.formatDate(new Date(num)));
          console.log("dateArr", dateArr);
          const proAll = Promise.all(
            dateArr.map((date) => {
              return APIs.ActiveData_getHeatMap({
                siteId: this.$route.params.siteId,
                date,
                minStay: customizeOption.site.tab2.getHeatMap.minStay_get(),
              }).then((res) => {
                if (res.code === 0) {
                  return res.data;
                } else {
                  throw res.msg;
                }
              });
            })
          );
          proAll
            .then((arr) => {
              console.log("proAll", arr);
              this.hotmapData = this.formatHotmapData(arr.flat());
            })
            .then(
              (res) => {
                this.tab2.loading = false;
              },
              (err) => {
                this.tab2.loading = false;
              }
            );
        }
      }
    },
    tab2_render() {
      console.log("---------tab2-render---------");
      const index = this.tab2.hotmapIndex;
      const date = this.tab2.date || this.formatDate(new Date());
      console.log("date", date);
      if (index === "0") {
        // 更新总热力图数据
        // this.hotmapData = this.formatHotmapData(this.tab2.hotmap1);
        this.getHeatMapData();
      } else if (index === "1") {
        // 更新单日热力图数据
        // this.hotmapData = this.formatHotmapData(this.tab2.hotmap0);
        this.getHeatMapData(date);
      }
    },

    // tab4
    tab4_handlePageChange({currentPage, pageSize}) {
      console.log("tab4_handlePageChange", {currentPage, pageSize});
      const pageinfo = this.tab4.pageinfo;
      pageinfo.currentPage = currentPage;
      pageinfo.pageSize = pageSize;
      this.tab4_getTableData();
    },
    tab4_getTableData() {
      const {currentPage: current, pageSize: size} = this.tab4.pageinfo;
      const {name, phone, carType: model} = this.tab4.query;
      this.tab4.loading = true;
      APIs.Comic_page({
        siteId: this.$route.params.siteId,
        name,
        phone,
        model,
        current,
        size,
      })
        .then((res) => {
          console.log(res);
          if (res.code === 0) {
            this.tab4.tableData = res.data.list;
            this.tab4.pageinfo.totalResult = res.data.totalCount;
          } else {
            this.$message.error(res.msg);
            throw res.msg;
          }
        })
        .finally(() => {
          this.tab4.loading = false;
        });
    },
    tab4_getTableDataPage1() {
      this.tab4.pageinfo.currentPage = 1;
      this.tab4_getTableData();
    },
    async tab4_download() {
      this.tab4.downloading = true;
      let notify1 = {
        close() {
        }
      };
      Utils.setTimeoutPro(1000).then(() => {
        // 还没下载好，弹出notify
        const loading = this.tab4.downloading;
        if (loading) {
          notify1 = this.$notify({
            title: "导出文件准备中",
            message: "准备工作会在后台进行，你可以选择进行其他操作",
            duration: 0,
          });
        }
      });
      const res = await APIs.Comic_download({
        siteId: this.$route.params.siteId,
      }).finally(() => {
        this.tab4.downloading = false;
        notify1.close();
      });
      console.log(7, res);
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      }); // 转化为blob对象
      let filename = new Date().toLocaleString() + "数据.xls"; // 判断是否使用默认文件名
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
        const tempLink = document.createElement("a"); // 创建一个a标签
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename); // 给a标签添加下载属性
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink); // 将a标签添加到body当中
        tempLink.click(); // 启动下载
        document.body.removeChild(tempLink); // 下载完毕删除a标签
        window.URL.revokeObjectURL(blobURL);
      }
      console.log("-----------download done-----------");
    },
    tab4_tapEdit({id, name, phone}) {
      Object.assign(this.tab4.updateDialog, {
        id,
        name,
        phone,
        visible: true,
      });
    },
    tab4_update() {
      const {name, phone, id} = this.tab4.updateDialog;
      if (!name) {
        this.$message("请输入姓名");
        return;
      } else if (!phone) {
        this.$message("请输入手机号");
        return;
      } else {
        console.log("id", id);
        APIs.Comic_update({
          id,
          name,
          phone,
        })
          .then((res) => {
            if (res.code === 0) {
              this.$message.success("修改成功");
            } else {
              this.$message.error(res.msg);
            }
          })
          .finally(() => {
            this.tab4.updateDialog.visible = false;
            this.tab4_getTableDataPage1();
          });
      }
    },
    tab4_tapViewPhoto(playerId) {
      APIs.Comic_listComic({playerId}).then((res) => {
        if (res.code === 0) {
          Object.assign(this.tab4.pictureDialog, {
            srcArr: res.data.map((item) => unescape(item.comic)),
            visible: true,
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // tab5
    tab5_getConfig() {
      // 1. 拿到站点配置
      Object.assign(this.tab5, {
        name: this.siteData.name,
        surveillanceVideo: this.tab5_getRealSurveillanceVideoUrl().url,
        duration: [
          this.formatDate(new Date(this.siteData.begin)),
          this.formatDate(new Date(this.siteData.deadline)),
        ],
        heatMapBackground: this.siteData.heatMapBackground,
      });
      // 2. 拿到线上自定义配置
      const optionOnline = this.tab5_getRealSurveillanceVideoUrl().option;
      if (optionOnline) {
        console.log("已拿到线上配置", JSON.parse(JSON.stringify(optionOnline)));
        // 将对应的参数格式化
        checkParam(optionOnline.site.tab2.getHeatMap, "minStay");
        // 将线上配置融合进本地原始配置
        recover();
        _.merge(this.customizeOption, optionOnline);
      } else {
        console.log("未拿到线上配置");
        // 没拿到
      }
      // 3. 将本地配置拷贝后赋值给表单数据
      // 拷贝来的函数由于作用域问题也无法使用，因此只需要普通的json化
      this.tab5.option = JSON.parse(JSON.stringify(this.customizeOption));
      // 混入的双向绑定字段要初始化
      this.tab5.option.site.tab2.getHeatMap._minStay =
        this.customizeOption.site.tab2.getHeatMap.minStay_get(
          this.tab5.optionDate
        );
      // 刷新json-editor
      this.tab5.option.site.tab1.section3._fakeDailyTab1ChartData =
        this.customizeOption.site.tab1.section3.fakeDailyTab1ChartData_get(
          this.tab5.optionDate
        );
    },
    tab5_setConfig() {
      // 表单校验
      if (!this.tab5.name) {
        this.$message("站名不能为空");
        return;
      } else if (!this.tab5.surveillanceVideo) {
        this.$message("摄像头链接不能为空");
        return;
      } else if (!this.tab5.heatMapBackground) {
        this.$message("热力图背景图片链接不能为空");
        return;
      } else if (
        typeof this.tab5.option.index.downloadMobileBySite.stayMin !==
        "number" ||
        typeof this.tab5.option.index.downloadMobileBySite.stayMax !==
        "number" ||
        typeof this.tab5.option.site.tab1.section1.stayMin.value !== "number" ||
        typeof this.tab5.option.site.tab1.section1.stayMax.value !== "number" ||
        typeof this.tab5.option.site.tab1.section1.downloadingKeyModelsBtn
          .minStay !== "number" ||
        typeof this.tab5.option.site.tab1.section2.getPartitionCount.minStay !==
        "number" ||
        typeof this.tab5.option.site.tab1.section4.downloadMobile.stayMin !==
        "number" ||
        typeof this.tab5.option.site.tab1.section4.downloadMobile.stayMax !==
        "number" ||
        (this.tab5.option.site.tab2.getHeatMap._minStay &&
          typeof this.tab5.option.site.tab2.getHeatMap._minStay !== "number")
      ) {
        this.$message("参数类型不正确，请输入数字");
        return;
      } else if (!this.tab5.option.site.tab1.section1.stayMin.text) {
        this.$message("筛选人数-stayMin文本不能为空");
        return;
      } else if (!this.tab5.option.site.tab1.section1.stayMax.text) {
        this.$message("筛选人数-stayMax文本不能为空");
        return;
      }
      // 拷贝一个本地配置的副本
      const option = JSON.parse(JSON.stringify(this.customizeOption));
      // 修改对应项
      option.configurable = undefined; // 本地配置，不传线上
      option.index.downloadMobileBySite =
        this.tab5.option.index.downloadMobileBySite;
      option.index.visible = this.tab5.option.index.visible;
      option.site.tab1.section1.downloadingKeyModelsBtn.minStay =
        this.tab5.option.site.tab1.section1.downloadingKeyModelsBtn.minStay;
      option.site.tab1.section1.stayMin =
        this.tab5.option.site.tab1.section1.stayMin;
      option.site.tab1.section1.stayMax =
        this.tab5.option.site.tab1.section1.stayMax;
      option.site.tab1.section2.getPartitionCount.minStay =
        this.tab5.option.site.tab1.section2.getPartitionCount.minStay;
      option.site.tab1.section4.downloadMobile =
        this.tab5.option.site.tab1.section4.downloadMobile;
      if (true || this.tab5.option.site.tab2.getHeatMap._minStay) {
        option.site.tab2.getHeatMap.minStay =
          this.customizeOption.site.tab2.getHeatMap.minStay_set(
            this.tab5.option.site.tab2.getHeatMap._minStay,
            this.tab5.optionDate
          );
      }
      // option.site.tab2.getHeatMap.minStay = 10; // 调试，模拟线上未格式化的数据
      if (this.tab5.optionDate) {
        const date = this.tab5.optionDate;
        option.site.tab1.section3.fakeDailyTab1ChartData =
          this.customizeOption.site.tab1.section3.fakeDailyTab1ChartData_set(
            this.tab5.jsonEditor.get(),
            date
          );
      }

      const data = {
        id: this.siteData.id,
        name: this.tab5.name,
        begin: +new Date(this.tab5.duration[0] + " 00:00:00"),
        deadline: +new Date(this.tab5.duration[1] + " 23:59:59"),
        heatMapBackground: this.tab5.heatMapBackground,
        surveillanceVideo: JSON.stringify([
          escape(this.tab5.surveillanceVideo),
          option,
        ]),
      };
      console.log(data);
      APIs.Site_update({
        ...data,
        id: this.siteData.id,
        name: data.name,
        begin: data.begin,
        deadline: data.deadline,
      }).then((res) => {
        if (res.code === 0) {
          this.getSiteData().then(() => {
            this.tab5_getConfig();
          });
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.msg);
          throw res.msg;
        }
      });
    },
    tab5_getRealSurveillanceVideoUrl() {
      return getRealSurveillanceVideoUrl(this.siteData.surveillanceVideo);
    },
    tab5_changeOptionDate(date) {
      console.log(date);
      this.tab5.option.site.tab2.getHeatMap._minStay =
        this.customizeOption.site.tab2.getHeatMap.minStay_get(date);
      this.tab5.option.site.tab1.section3._fakeDailyTab1ChartData =
        this.customizeOption.site.tab1.section3.fakeDailyTab1ChartData_get(
          date
        );
    },
    tab5_updateJsonEditor(newVal) {
      console.log("update-json-editor", newVal);
      if (!this.tab5.jsonEditor) {
        this.tab5.jsonEditor = new JSONEditor(
          this.$refs["json-editor"],
          // option
          {
            onChange: () => {
              const data = this.tab5.jsonEditor.get();
              // console.log(data);
              // this.tab5.option.site.tab1.section3._fakeDailyTab1ChartData = data;
            },
          },
          // json
          this.tab5.option.site.tab1.section3._fakeDailyTab1ChartData
        );
      } else {
        this.tab5.jsonEditor.set(newVal);
      }
    },
    tab5_getRealDailyTab1ChartData() {
      const date = this.tab5.optionDate;
      if (!date) {
        this.$message("日期不能为空，请选择拿取某个日期的真实数据");
        return;
      }
      this.tab1.duration = [1, 2].map(() => new Date(date));
      this.tab1_render();
    },
    tab5_parseStickData(text) {
      console.log("text", text);
      let data;
      if (text === "") {
        // 为了实现空字符串的传递，达成删除功能
        text = '""';
      }
      try {
        data = Function(`return ${text}`)();
        console.log("parseStickData", data);
        return data;
      } catch (error) {
        // error对象特殊
        // console.log("this", this);
        this.$message.error(`${error.name}: ${error.message}`);
        throw error;
      }
    },
    tab5_stickIntoJsonEditor() {
      this.$prompt("请粘贴数据，粘贴空字符串 '' 清空折线图")
        .then((res) => {
          // console.log("stick");
          if (res.value) {
            const obj = this.tab5_parseStickData(res.value);
            console.log("obj", obj !== "");
            console.log("res.value", res.value);
            if ((obj && typeof obj === "object") || obj === "") {
              this.tab5.option.site.tab1.section3._fakeDailyTab1ChartData = obj;
            } else {
              this.$message("请粘入符合格式的数据");
            }
          } else {
            this.$message("请粘贴数据，粘贴空字符串 '' 清空折线图");
          }
        })
        .catch((err) => console.log(err));
    },

    console_log(...args) {
      console.log("args", args);
    },
  },
  beforeCreate() {
    console.log("================before-create================");
    console.log("siteOffsetData", this.siteOffsetData);
  }, // 生命周期 - 创建之前
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getSiteData().then(() => {
      this.tab5_getConfig();
      this.tab1_render();
    });
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  beforeMount() {
  }, // 生命周期 - 挂载之前
  mounted() {
    this.isMounted = true;
  },
  beforeUpdate() {
  }, // 生命周期 - 更新之前
  updated() {
  }, // 生命周期 - 更新之后
  beforeDestroy() {
    this.endTab1Timer();
  }, // 生命周期 - 销毁之前
  destroyed() {
  }, // 生命周期 - 销毁完成
  activated() {
    console.log("============activated============");
    this.startTab1Timer();
  },
  deactivated() {
    console.log("============deactivated============");
    this.endTab1Timer();
  },
};
</script>

<style lang="less" scoped>
.white {
  background: white;
  border-radius: 4px;
  border: 1px solid #cfd7e5;
}

.wrap {
  user-select: none;
  display: flex;
  flex-direction: column;
  // width: 100%;
  // height: 100%;
  .menu {
    // background: #0007;
    .menu-item {
      width: 10em;
      text-align: center;
    }
  }

  & /deep/ .el-tabs__content {
    padding: 0;
  }


  .tab-content {
    display: block;
    // padding: 10px;
    &.tab1 {
      .section {
        padding: 25px;

        &.section1 {
          border-bottom: 1px solid #d9d9d9;

          .countInfo {
            font-size: 14px;
            display: flex;
            // align-items: center;
            justify-content: flex-end;
            margin-top: 35px;
            flex-direction: column;

            .left {
              display: flex;
              margin-bottom: 15px;
              margin-left: 10px;

              .span {
                display: block;
                width: 10em;

                i.icon {
                  color: #5ba8fd;
                }

                i.num {
                  font-size: 1.8em;
                  // font-weight: bolder;
                  font-style: normal;
                  vertical-align: middle;
                }
              }
            }
          }
        }

        &.section2 {
          border-bottom: 1px solid #d9d9d9;

          & > h4 {
            margin: 0 0 20px;
          }

          .onlineState-box {
            display: flex;
            // justify-content: space-between;
            .row {
              height: 2em;
              line-height: 2em;
            }

            .heading {
              & > div {
                width: 8em;
              }

              .row1 {
                width: 1em;
                // height: 1.5em;
              }
            }

            .box-item-wrap {
              width: 100%;
              display: flex;
              justify-content: space-around;

              .box-item {
                .row2 {
                  span.state {
                    display: flex;
                    align-items: center;

                    span.dot {
                      // display: block;
                      width: 10px;
                      height: 10px;
                      border-radius: 50%;
                      margin: 0 10px;
                    }

                    &.on {
                      span.dot {
                        background: #6ec71e;
                      }
                    }

                    &.off {
                      color: #d9021d;

                      span.dot {
                        background: #f56e6a;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        &.section3 {
          border-bottom: 10px solid #eef0f4;
        }
      }
    }

    &.tab2 {
      // width: 100%;
      height: 100%;

      .heatmap {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }

    &.tab3 {
      // width: 100%;
      height: 100%;

      iframe {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }

    &.tab4 {
      min-height: 33em;
    }
  }
}

// 弹窗
.pictureDialog {
  .list-wrap {
    width: 100%;
    aspect-ratio: 3/2;
    overflow: auto;

    .list {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      // background: #0007;
      img.list-item {
        display: block;
        width: 30%;
        aspect-ratio: 1;
        // background: #f007;
        margin: 1.5%;
        object-fit: contain;
      }
    }
  }
}

// 内层弹窗（但是append to body）
.pictureInnerDialog {
  img.preview {
    width: 100%;
    height: auto;
    display: block;
  }
}

.site-title {
  font-weight: normal;
  margin: 0;
  height: 1.5em;
  text-align: center;
}

// 手机端硬适配
@media screen and (max-width: 1000px) {
  .site-title {
    // background: red;
    font-size: 1em;
  }

  .pie {
    left: 21vw !important;
    top: -7vw !important;
  }

  #pie1 {
    margin-left: -190px;
  }

  .white {
    margin-top: 1px !important;
  }

  /deep/ .d2-container-ghost__header {
    padding: 0 !important;
  }

  /deep/ .d2-container-ghost__footer {
    padding: 0 !important;
    padding-top: 0.3em !important;
  }

  .tab2-header {
    margin-top: -20px;
  }

  .el-form-item {
    margin-bottom: 5px;
  }

  .tab4-pane {
    padding-top: 8px !important;
  }

  .tab1 {
    .section {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
    }

    .section1 {
      .countInfo {
        margin-top: 8px !important;
      }
    }

    .section2 {
      h4 {
        margin-bottom: 0px !important;
      }
    }
  }
}
</style>

<style lang="less">
// 日期弹窗个性化，用来区分那些有特殊设置的日期
// 由于弹窗自身不带scope，所以只能写一个全局样式
.el-date-picker {
  // 有特殊设置
  .special {
    outline: 2px solid;
    outline-offset: -4px;
  }

  // 标记热力图minStay的特殊设置
  .special1::before {
    content: "A";
    display: block;
    position: absolute;
    top: -5px;
    left: 4px;
    transform: scale(0.8);
    color: red;
  }

  // 标记tab1折线图假数据的特殊设置
  .special2::after {
    content: "B";
    display: block;
    position: absolute;
    top: -5px;
    right: 4px;
    transform: scale(0.8);
    color: blue;
  }
}
</style>

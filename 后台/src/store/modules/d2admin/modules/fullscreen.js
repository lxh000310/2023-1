import screenfull from 'screenfull';
// window.screenfull = screenfull;

export default {
  namespaced: true,
  state: {
    // 全屏激活
    active: false
  },
  actions: {
    /**
     * @description 初始化监听
     * @param {Object} context
     */
    listen ({ commit }) {
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          if (!screenfull.isFullscreen) commit('set', false)
        })
      }
    },
    /**
     * @description 切换全屏
     * @param {Object} context
     */
    toggle ({ commit, state }) {
      if(screenfull.isEnabled) {
        if (screenfull.isFullscreen) {
        screenfull.exit()
        commit('set', false)
      } else {
        screenfull.request()
        commit('set', true)
      }
      }else {
        // 不支持全屏时，比如 iphone
        commit('set', !state.active);
      }
      
    }
  },
  mutations: {
    /**
     * @description 设置 store 里的全屏状态
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set (state, active) {
      state.active = active
    }
  }
}

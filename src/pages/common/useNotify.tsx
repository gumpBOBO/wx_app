import { inject } from 'vue'

export const useNotify = (stateNotify: stateNotifyType) => {
	// 获取系统相关信息
	const customGlobalData: any = inject('$customGlobalData')
  return () => (
    <nut-notify
			is-Link
      onClick={stateNotify.clickFun}
      onClosed={stateNotify.closedFun}
      color={stateNotify.color}
      background={stateNotify.background}
      type={stateNotify.type}
      v-model:visible={stateNotify.show}
      msg={stateNotify.msg}
      duration={stateNotify.duration}
			className={stateNotify.class}
			style={`height: ${customGlobalData.topbarBoxHeight}px; padding-top: ${customGlobalData.menuButtonInfo.top}px; line-height: 30px; text-indent: -50px;`}
    >
		</nut-notify>
  )
}

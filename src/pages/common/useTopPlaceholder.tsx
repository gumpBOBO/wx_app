export const useTopPlaceholder = (customGlobalData: any) => {
	{/* 占位符 == 置顶的头部导航 */}
  return () => (
		<div style={`height: ${customGlobalData.topbarBoxHeight}px;`}></div>
  )
}

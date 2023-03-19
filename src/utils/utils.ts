/**
 * 获取当前时间
 * @params length 截取的长度
 * @return stringDate 字符串时间
 * $getCurrentDate() => 2021-05-21 13:15:28
 * $getCurrentDate(10) => 2021-05-21
 * $getCurrentDate(16) => 2021-05-21 13:15
 */
export const getCurrentDate = (length: number = 19): string => {
  let date = new Date()
  return `${date.toLocaleDateString()}&${date.toTimeString().slice(0, 8)}`
    .replace(/(\d{4})\/(\d{1,})\/(\d{1,})&/, (all, s1, s2, s3) => {
      return `${s1}-${('0' + s2).slice(-2)}-${('0' + s3).slice(-2)} `
    })
    .slice(0, length)
}

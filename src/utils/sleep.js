export default function sleep (time = 300) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}

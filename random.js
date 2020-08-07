function randomIndex(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomLetter() {
  const totalLetter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const splitLetter = totalLetter.split('')
  let randomLetter = ''
  for (let i = 0; i < 5; i++) {
    randomLetter += randomIndex(splitLetter)
  }
  return randomLetter
}

module.exports = generateRandomLetter
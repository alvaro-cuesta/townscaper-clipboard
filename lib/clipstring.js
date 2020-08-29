// IMPORTANT NOTES:
//
// Input looks like base64url but IT IS NOT! Notice the alphabet's out-of-order "w"
// and the swapped "_" and "-" when compared to RFC 4648 §5.
//
// Townscaper decodes clip strings left-to-right and LSB first (both in BitArray index
// and character bits). This means the "base64" output is reversed.
//
// Later, when reading values, they're read in bit blocks from LSB to MSB. I.e. values
// are read right-to-left (but their bits are still LSB on the right).
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyzw0123456789_-'
const BITS_PER_CHAR = 6

const clipStringToBitString = (clipString) =>
  clipString
    .split('')
    .reverse()
    .map(x => {
      const value = ALPHABET.indexOf(x)

      if (value === -1) {
        throw new Error(`Invalid clip string character ${x}`)
      }

      return value
        .toString(2)
        .padStart(BITS_PER_CHAR, '0')
    })
    .join('')

const bitStringToClipString = (bitString) => {
  for (const bit of bitString) {
    if (bit !== '0' && bit !== '1') {
      throw new Error(`Invalid bit value ${bit}`)
    }
  }

  if ((bitString.length % BITS_PER_CHAR) !== 0) {
    throw new Error(`Bit string length (${bitString.length}) must be a multiple of ${BITS_PER_CHAR}`)
  }

  return Array(bitString.length / BITS_PER_CHAR)
    .fill()
    .map((_, i) => {
      const bits = bitString
        .slice(i * BITS_PER_CHAR, (i + 1) * BITS_PER_CHAR)

      const value = parseInt(bits, 2)

      return ALPHABET[value]
    })
    .reverse()
    .join('')
}

module.exports = {
  clipStringToBitString,
  bitStringToClipString,
  BITS_PER_CHAR,
}

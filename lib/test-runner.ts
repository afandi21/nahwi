import { TestAssertion, TestResult, ChallengeType } from '@/types'

/**
 * Normalizes Arabic string by trimming, replacing multiple spaces, 
 * and applying Unicode NFC normalization to handle diacritic variations.
 */
const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').normalize('NFC')

/**
 * Main evaluation engine for Nahwi challenges.
 * Runs 100% client-side in the browser.
 */
export function runTests(
  userAnswer: string,
  tests: TestAssertion[],
  validAnswers: string[],
  challengeType: ChallengeType
): TestResult[] {
  return tests.map((test) => {
    let passed = false

    switch (test.type) {
      case 'not_empty':
        passed = userAnswer.trim().length > 0
        break

      case 'in_valid_answers':
        passed = validAnswers.some((v) => normalize(v) === normalize(userAnswer))
        break

      case 'exact_match':
        passed = normalize(userAnswer) === normalize(test.expected || '')
        break

      case 'word_position_has_char':
        if (test.word_index !== undefined && test.char_code) {
          const words = userAnswer.trim().split(' ')
          const word = words[test.word_index] || ''
          const targetChar = String.fromCodePoint(parseInt(test.char_code, 16))
          passed = word.includes(targetChar)
        }
        break

      case 'contains_char':
        if (test.char_code) {
          const ch = String.fromCodePoint(parseInt(test.char_code, 16))
          passed = userAnswer.includes(ch)
        }
        break

      case 'regex':
        if (test.pattern) {
          try {
            passed = new RegExp(test.pattern, 'u').test(userAnswer)
          } catch (e) {
            console.error('Invalid regex pattern:', test.pattern)
            passed = false
          }
        }
        break

      default:
        passed = false
    }

    return { ...test, passed }
  })
}

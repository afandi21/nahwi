export type ChallengeType = 'harakat' | 'multiple_choice' | 'fill_blank'

export interface TestAssertion {
  id: string
  description: string
  type: 'not_empty' | 'in_valid_answers' | 'exact_match' | 'word_position_has_char' | 'contains_char' | 'regex'
  word_index?: number
  char_code?: string
  expected?: string
  pattern?: string
}

export interface TestResult extends TestAssertion {
  passed: boolean
}

export interface Challenge {
  id: string
  section_id: string
  title: string
  materi_text: string
  arabic_sentence: string
  type: ChallengeType
  valid_answers: string[]
  correct_answer?: string
  choices: { value: string; label: string }[]
  tests: TestAssertion[]
  irab_tree: any // Structure for parse tree
  translation: string
  order_index: number
}

export interface Curriculum {
  id: string
  title: string
  slug: string
  description: string
  order_index: number
  is_published: boolean
}

export interface CertificateTemplate {
  id: string
  curriculum_id: string
  template_name: string
  template_mime_type: string
  template_content: string
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  curriculum_id: string
  title: string
  order_index: number
  is_published: boolean
}

export interface UserProgress {
  user_id: string
  challenge_id: string
  is_completed: boolean
  last_answer: string
  attempts: number
  completed_at: string
}

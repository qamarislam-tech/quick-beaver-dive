def generate_lesson_plan(subject: str, level: str, topic: str) -> str:
    return f"""
      ## Lesson Plan: {subject} - {level} - {topic}

      **Objectives:**
      1. Students will be able to define key concepts related to {topic}.
      2. Students will be able to apply formulas/principles of {topic} to solve problems.
      3. Students will demonstrate understanding through practice questions.

      **Materials:** Whiteboard, markers, worksheets, textbooks.

      **Lesson Flow:**
      1. **Introduction (10 min):**
         - Review previous topic.
         - Introduce {topic} with real-world examples.
         - Discuss learning objectives.
      2. **Concept Explanation (20 min):**
         - Explain core theories and definitions.
         - Work through example problems.
      3. **Guided Practice (15 min):**
         - Students attempt questions with teacher guidance.
      4. **Independent Practice (15 min):**
         - Students work on worksheet questions.
      5. **Conclusion & Q&A (10 min):**
         - Summarize key takeaways.
         - Address student questions.
         - Assign homework.

      **Assessment:** Observation, worksheet completion, Q&A.
    """

def generate_worksheet(subject: str, level: str, topic: str) -> str:
    return f"""
      ## Worksheet: {subject} - {level} - {topic}

      **Instructions:** Answer all questions. Show your working clearly.

      **Section A: Multiple Choice Questions**
      1. Which of the following best describes {topic}?
         a) Option A
         b) Option B
         c) Option C
         d) Option D
         *Suggested Answer: c)*

      2. What is the primary function of [concept related to {topic}]?
         a) Option A
         b) Option B
         c) Option C
         d) Option D
         *Suggested Answer: a)*

      **Section B: Structured Questions**
      3. Explain in your own words the concept of {topic}. (3 marks)
         *Suggested Answer: [Detailed explanation of {topic}]*

      4. A problem involves [scenario related to {topic}]. Calculate [value]. (4 marks)
         *Suggested Answer: [Step-by-step solution]*

      5. Discuss two real-world applications of {topic}. (4 marks)
         *Suggested Answer: [Application 1 with explanation, Application 2 with explanation]*
    """

def generate_parent_update_text(student_name: str, marks: str, comments: str) -> str:
    return f"""
Dear Parents,

This is an update regarding {student_name}'s progress.

Recent Assessment Marks: {marks}

Teacher Comments:
{comments}

We encourage you to discuss these results with {student_name} and reach out if you have any questions.

Sincerely,
Class Teacher
"""
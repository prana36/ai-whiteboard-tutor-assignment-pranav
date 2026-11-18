# AI-Powered Interactive Whiteboard Tutor — Technical Assignment

Welcome to the Braynix Studios technical assignment.

Your task is to build a working, end-to-end **AI-powered Interactive Whiteboard Tutor** that teaches a learner a topic through visual demonstrations and synchronized voice narration.

This is the same assignment for every applicant, regardless of the role or category they originally applied for.

## 1. Objective

Build an application where a learner enters a topic, receives a short AI-generated lesson of approximately **2 minutes**, and learns primarily by watching an interactive whiteboard demonstration while listening to the tutor explain the concept.

The experience should feel like a real tutor teaching on a whiteboard—not a chatbot that only displays paragraphs, and not a static video embedded in a webpage.

## 2. Required user flow

1. The learner opens the application and enters a topic in a chat-first interface.
2. The application generates a structured lesson using an AI model.
3. The tutor presents the lesson through voice narration and visual whiteboard actions.
4. Whiteboard actions stay synchronized with the narration as the lesson progresses.
5. The learner can pause, resume, seek, replay, or restart the lesson.
6. After the lesson, the learner can ask follow-up questions and receive relevant AI-generated answers.

## 3. Core requirements

### A. Topic input and AI lesson generation
- Provide a clean chat-first screen where the learner can enter a topic.
- Use an AI model/API (for example, Gemini or an equivalent model) to generate the lesson.
- Aim for approximately two minutes of teaching.
- Generate a structured sequence of narration segments and corresponding whiteboard actions.
- Handle loading states, invalid input, and AI/API errors gracefully.

### B. Interactive whiteboard
- Provide a visible whiteboard or canvas for teaching.
- Demonstrate concepts using appropriate visual elements such as diagrams, shapes, arrows, labels, drawings, equations, highlights, and annotations.
- Reveal or update elements step by step as the lesson progresses.
- Prefer clear visual explanations over large blocks of text.
- The whiteboard should communicate the concept, not merely decorate the screen.

### C. Voice narration and synchronization
- Include spoken narration using a text-to-speech service or another suitable voice solution.
- Synchronize narration with the relevant whiteboard actions.
- The visual state should update at the appropriate point in the explanation.
- Avoid a disconnected experience where the voice explains one step while the board displays another.

### D. Lesson playback controls

Provide working controls for:
- Play
- Pause
- Resume
- Seek or move through the lesson timeline
- Restart
- Replay

Playback controls must affect the actual lesson and its synchronized narration/visual sequence.

### E. Follow-up interaction
- Allow the learner to ask questions about the lesson.
- Use AI to generate contextually relevant answers.
- Handle follow-up loading and error states clearly.

### F. Deployment
- Deploy the application to a publicly accessible hosting platform.
- Submit a live demo URL that evaluators can open and use.
- Ensure the deployed application does not depend on your local development environment.

## 4. Technical expectations

You may choose your own frontend, backend, database, whiteboard/canvas library, AI provider, and hosting platform.

You may use AI coding assistants and other development tools. However, you must understand the code you submit and be able to explain your key implementation decisions.

Your implementation should demonstrate:
- A clear separation of concerns.
- Readable, organized, maintainable code.
- Sensible handling of asynchronous operations and errors.
- Secure handling of API keys and environment variables.
- A reliable relationship between lesson data, narration, and whiteboard events.

You do not need to use a specific technology stack. Choose tools that help you deliver a reliable working product.

## 5. Submission requirements

Submit **all three** items:

1. **GitHub repository URL** — the complete source code.
2. **Live demo URL** — a deployed, working application.
3. **Google Form submission** — provide your details and both URLs using the submission form shared with you by the Braynix Studios team.

Before submitting, verify that:
- The repository is accessible to evaluators.
- The README explains how to install and run the project.
- Required environment variables are documented (use placeholders, never real secrets).
- The live demo URL works.
- The main user flow can be completed without relying on local files or services.

## 6. Evaluation rubric

The assignment will be evaluated out of **100 points**.

| Evaluation area | Points | What we look for |
|---|---:|---|
| End-to-end functionality | 25 | The complete learner flow works, from entering a topic to completing a lesson and asking a follow-up question. |
| AI lesson generation | 15 | The lesson is meaningfully AI-generated, structured, coherent, and appropriate to the topic. |
| Whiteboard demonstrations | 20 | Visual explanations are useful, clear, step-by-step, and relevant to the narration. |
| Voice and timeline synchronization | 15 | Narration and whiteboard events remain aligned; playback and seeking behave reliably. |
| UI/UX and usability | 10 | The product is intuitive, responsive, accessible, and pleasant to use. |
| Code quality and architecture | 10 | Code is organized, understandable, maintainable, and handles errors appropriately. |
| README and documentation | 5 | Setup, configuration, architecture, and usage instructions are clear. |
| **Total** | **100** | |

### Evaluation guidance

- **85–100:** Strong submission
- **70–84:** Promising submission
- **50–69:** Needs further evaluation
- **Below 50:** Does not currently meet the expected standard

These bands are guidance; the final assessment may also consider the applicant's ability to explain and demonstrate their implementation.

## 7. Important rules

- **Build a functional product, not only a UI prototype.**
- AI-generated lesson content and follow-up answers should be real. Do not substitute hardcoded or prewritten responses while presenting them as live AI output.
- Do not use a static prerecorded video as a replacement for synchronized whiteboard teaching.
- Visible controls must work. Do not include buttons or interactions that do nothing.
- Do not commit API keys, passwords, tokens, or other credentials. Use environment variables and provide an example environment file with placeholder values if needed.
- Include clear local setup instructions in your repository.
- Make sure the deployed demo is available for evaluation.
- Be prepared to explain the architecture, AI integration, synchronization approach, and important code decisions.

## 8. Suggested README sections for your submission repository

Your own project repository should include:
- Project overview
- Features
- Technology stack
- Architecture or data-flow overview
- Prerequisites
- Local installation and setup
- Environment variables
- How to run the application
- Live demo URL
- Known limitations or unfinished items

## 9. What a successful submission looks like

A successful submission lets an evaluator:
1. Open the deployed application.
2. Enter a topic they choose.
3. Generate an AI-powered lesson.
4. Watch the whiteboard demonstrate the topic while hearing synchronized narration.
5. Pause, resume, seek, restart, and replay the lesson.
6. Ask a follow-up question and receive a relevant AI response.

The quality of the learning experience matters more than the number of features. Focus on making the core teaching flow genuinely work.

---

**Braynix Studios**  
*Building AI-powered products and solutions.*

For assignment-related clarification, contact the Braynix Studios team through the communication channel used to share this assignment.

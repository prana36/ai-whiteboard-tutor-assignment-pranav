# Evaluation and submission walkthrough

## Real-provider smoke test

Use an OpenAI API key with active billing. Test locally and again on the public production URL. Automated tests mock the provider; they do not establish that deployment credentials work.

1. Enter **How binary search finds a number**. Confirm that a fresh lesson has topic-specific diagrams, chapters, a transcript, and a quiz. Generate an unrelated second topic, such as **Why the Moon has phases**, to verify arbitrary-topic content.
2. Click **Prepare voice**. Confirm progress advances and measured duration replaces the estimate. Click **Play**. Verify audible narration, progressive diagrams, and automatic chapter transitions.
3. Pause mid-chapter. Audio and the timeline must stop together. Resume at that point.
4. Seek forward and backward while playing. Future elements should disappear on rewind. Jump using chapter buttons and transcript entries. Both narration and board must move.
5. Restart; confirm the lesson pauses at the beginning. Test replay, mute/unmute, and speed changes.
6. Draw, highlight, undo, change chapters, and return. Annotations must remain scoped to their original chapter during the session. Export and inspect an SVG.
7. Click a diagram label with the select tool. Send the composed question, then ask **Can you explain that with a simpler example?** Verify lesson/conversation context in the response.
8. Answer the concept check and review its feedback. Try again to reset.
9. Open My lessons, search, reload, and reopen. Lesson data should remain; narration preparation is required again.
10. Repeat on a phone-sized screen. Switch Conversation/Whiteboard tabs and check for page overflow.

## Failure paths

- Missing/invalid key produces a clear error rather than sample content masquerading as live AI.
- Blank/short topics get helpful feedback.
- Provider quota/rate errors preserve input for retry.
- Speech errors offer an explicit browser-voice alternative when available.
- Unsupported browser speech reports a meaningful error.
- Canceling a lesson before starting another must not allow stale content to replace the new session.
- Follow-up questions pause playback for reading.
- Full/unavailable browser storage must not prevent the current lesson from working.

## Before submitting

- [ ] Your repository is accessible to evaluators.
- [ ] Production API credentials have quota.
- [ ] Live URL opens in incognito without a hosting login.
- [ ] The real-provider smoke test passes on production.
- [ ] The verified live URL appears in README.
- [ ] No secrets are in tracked files or Git history.
- [ ] A clean clone runs using `npm ci` and the documented setup.
- [ ] Unit tests, typecheck, build, and browser tests pass.
- [ ] The form contains your own repository and actual live demo links.
- [ ] Repository and demo remain accessible through evaluation.

## Interview discussion points

- Structured JSON and an allowlisted renderer versus generated executable drawing code.
- Audio as the clock; deterministic state reconstruction on seek.
- Exact scene transitions versus approximate within-scene reveal timing.
- Browser speech fallback limitations.
- Next.js route handlers as the Node backend.
- Local persistence now; authenticated Supabase storage for cross-device use later.
- Per-instance rate limits versus shared serverless limits.

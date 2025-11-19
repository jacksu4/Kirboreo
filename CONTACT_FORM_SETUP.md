# Contact Form Setup Guide

## 📧 Email Service Configuration

The contact form uses **Resend** to send emails. Follow these steps to set it up:

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address
3. Navigate to API Keys section

### 2. Get Your API Key

1. Click "Create API Key"
2. Give it a name (e.g., "Kirboreo Contact Form")
3. Select "Sending access"
4. Copy the generated API key

### 3. Add to Environment Variables

Add the following to your `.env.local` file:

```env
RESEND_API_KEY=re_your_actual_api_key_here
```

### 4. Test the Contact Form

1. Start your development server: `npm run dev`
2. Navigate to the About page: `http://localhost:3000/about`
3. Scroll to the "Get in Touch" section
4. Fill out and submit the form
5. Check your email at `sujingcheng1105@gmail.com`

## 🎨 Features

### Navigation Bar
- **Contact Us Button**: Replaced "Get Started" with an animated "Contact Us" button
- **Gradient Design**: Eye-catching cyan-to-purple gradient
- **Pulse Animation**: Email icon pulses to draw attention
- **Smooth Scroll**: Links directly to the contact form with `#contact` anchor

### Contact Form
- **Real-time Validation**: Client-side form validation
- **Loading States**: Button shows "Sending..." while processing
- **Success/Error Messages**: Visual feedback for submission status
- **Disabled State**: Form fields disabled during submission
- **Smooth Animations**: Slide-in animation for status messages

## 📝 Email Template

The email sent to `sujingcheng1105@gmail.com` includes:
- **Sender Name**: From the form
- **Sender Email**: For easy reply
- **Message Content**: Full message with preserved line breaks
- **Professional Formatting**: Clean HTML email template
- **Subject Line**: "New Contact Form Submission from [Name]"

## 🔒 Security Features

- Input validation (required fields)
- Email format validation
- Server-side validation
- Error handling for network issues
- Rate limiting (via Resend)

## 🚀 Deployment Notes

### Vercel Deployment
When deploying to Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `RESEND_API_KEY` with your API key
4. Redeploy the application

### Domain Verification (Optional but Recommended)
For production, you can:
1. Add your domain to Resend
2. Update the "from" email in `app/api/contact/route.ts`:
   ```typescript
   from: 'Kirboreo Contact <noreply@kirboreo.com>',
   ```

## 📊 Testing in Development

While testing locally, Resend provides:
- 100 emails/day on free tier
- Delivery to verified email addresses
- Sandbox mode for testing

## 🎯 Contact Button Highlights

The new "Contact Us" button features:
- ✉️ Animated email icon (pulse effect)
- Gradient background (cyan → purple)
- Hover effect (lift + glow)
- Mobile responsive
- Direct scroll to contact form

## 🐛 Troubleshooting

### Email not sending?
- Check if `RESEND_API_KEY` is set in `.env.local`
- Verify the API key is valid in Resend dashboard
- Check browser console for errors
- Check server logs for API errors

### Form not submitting?
- Check browser console for JavaScript errors
- Ensure all fields are filled
- Check network tab for API call status
- Verify `/api/contact/route.ts` is accessible

## 💡 Future Enhancements

Consider adding:
- CAPTCHA for spam protection
- Auto-reply to sender
- Save submissions to database
- Admin dashboard for viewing submissions
- Email notifications via other services (SendGrid, AWS SES)


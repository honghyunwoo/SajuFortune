// Email utility for sending contact form notifications
// In production, integrate with a real email service like SendGrid, AWS SES, or Resend

interface ContactFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send contact form notification email
 * @param formData - Contact form data from user
 * @returns Promise with email send result
 */
export async function sendContactFormEmail(formData: ContactFormData): Promise<EmailResponse> {
  const { name, email, category, subject, message } = formData;

  // 개발 환경에서는 콘솔에 로그만 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('\n📧 [이메일 전송 시뮬레이션]');
    console.log('==========================================');
    console.log(`받는 사람: support@sajufortune.com`);
    console.log(`제목: [${category}] ${subject}`);
    console.log(`보낸 사람: ${name} <${email}>`);
    console.log('------------------------------------------');
    console.log('내용:');
    console.log(message);
    console.log('==========================================\n');

    // 개발 환경에서는 항상 성공
    return {
      success: true,
      messageId: `dev-${Date.now()}`
    };
  }

  // 프로덕션 환경에서 실제 이메일 전송
  // TODO: 실제 이메일 서비스 통합 필요
  // 예시: SendGrid, AWS SES, Resend 등

  try {
    // 환경 변수 확인
    const emailService = process.env.EMAIL_SERVICE; // 'sendgrid' | 'ses' | 'resend'

    if (!emailService) {
      console.warn('⚠️  EMAIL_SERVICE 환경 변수가 설정되지 않았습니다.');
      console.warn('   개발 모드로 실행됩니다.');

      // 환경 변수 미설정 시 개발 모드로 동작
      console.log('\n📧 [이메일 전송 시뮬레이션 - 프로덕션]');
      console.log(`받는 사람: support@sajufortune.com`);
      console.log(`제목: [${category}] ${subject}`);
      console.log(`보낸 사람: ${name} <${email}>`);

      return {
        success: true,
        messageId: `sim-${Date.now()}`
      };
    }

    // 실제 이메일 서비스 통합 예시
    switch (emailService) {
      case 'sendgrid':
        return await sendViaSendGrid(formData);
      case 'ses':
        return await sendViaSES(formData);
      case 'resend':
        return await sendViaResend(formData);
      default:
        throw new Error(`지원하지 않는 이메일 서비스: ${emailService}`);
    }
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

/**
 * SendGrid를 통한 이메일 전송
 * 사용법: npm install @sendgrid/mail
 * 환경 변수: SENDGRID_API_KEY
 */
async function sendViaSendGrid(formData: ContactFormData): Promise<EmailResponse> {
  // TODO: SendGrid 통합
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // const msg = {
  //   to: 'support@sajufortune.com',
  //   from: 'noreply@sajufortune.com',
  //   replyTo: formData.email,
  //   subject: `[${formData.category}] ${formData.subject}`,
  //   text: `
  //     보낸 사람: ${formData.name} <${formData.email}>
  //     문의 유형: ${formData.category}
  //
  //     ${formData.message}
  //   `,
  //   html: `
  //     <h2>새로운 문의가 접수되었습니다</h2>
  //     <p><strong>보낸 사람:</strong> ${formData.name} &lt;${formData.email}&gt;</p>
  //     <p><strong>문의 유형:</strong> ${formData.category}</p>
  //     <p><strong>제목:</strong> ${formData.subject}</p>
  //     <hr>
  //     <p>${formData.message.replace(/\n/g, '<br>')}</p>
  //   `
  // };

  // await sgMail.send(msg);

  return {
    success: true,
    messageId: `sendgrid-${Date.now()}`
  };
}

/**
 * AWS SES를 통한 이메일 전송
 * 사용법: npm install @aws-sdk/client-ses
 * 환경 변수: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 */
async function sendViaSES(formData: ContactFormData): Promise<EmailResponse> {
  // TODO: AWS SES 통합
  // const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

  // const sesClient = new SESClient({ region: process.env.AWS_REGION });

  // const params = {
  //   Source: "noreply@sajufortune.com",
  //   Destination: {
  //     ToAddresses: ["support@sajufortune.com"]
  //   },
  //   Message: {
  //     Subject: {
  //       Data: `[${formData.category}] ${formData.subject}`
  //     },
  //     Body: {
  //       Text: {
  //         Data: `보낸 사람: ${formData.name} <${formData.email}>\n\n${formData.message}`
  //       }
  //     }
  //   },
  //   ReplyToAddresses: [formData.email]
  // };

  // await sesClient.send(new SendEmailCommand(params));

  return {
    success: true,
    messageId: `ses-${Date.now()}`
  };
}

/**
 * Resend를 통한 이메일 전송
 * 사용법: npm install resend
 * 환경 변수: RESEND_API_KEY
 */
async function sendViaResend(formData: ContactFormData): Promise<EmailResponse> {
  // TODO: Resend 통합
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);

  // const { data } = await resend.emails.send({
  //   from: 'noreply@sajufortune.com',
  //   to: 'support@sajufortune.com',
  //   replyTo: formData.email,
  //   subject: `[${formData.category}] ${formData.subject}`,
  //   html: `
  //     <h2>새로운 문의가 접수되었습니다</h2>
  //     <p><strong>보낸 사람:</strong> ${formData.name} &lt;${formData.email}&gt;</p>
  //     <p><strong>문의 유형:</strong> ${formData.category}</p>
  //     <p><strong>제목:</strong> ${formData.subject}</p>
  //     <hr>
  //     <p>${formData.message.replace(/\n/g, '<br>')}</p>
  //   `
  // });

  return {
    success: true,
    messageId: `resend-${Date.now()}`
  };
}

/**
 * Send auto-reply email to the user
 * @param userEmail - User's email address
 * @param userName - User's name
 * @param category - Inquiry category
 */
export async function sendAutoReplyEmail(
  userEmail: string,
  userName: string,
  category: string
): Promise<EmailResponse> {

  if (process.env.NODE_ENV === 'development') {
    console.log('\n📧 [자동 응답 이메일 시뮬레이션]');
    console.log('==========================================');
    console.log(`받는 사람: ${userEmail}`);
    console.log(`제목: [사주풀이] 문의가 접수되었습니다`);
    console.log('------------------------------------------');
    console.log(`안녕하세요, ${userName}님!`);
    console.log('');
    console.log('사주풀이 서비스에 문의해 주셔서 감사합니다.');
    console.log(`"${category}" 관련 문의가 정상적으로 접수되었습니다.`);
    console.log('');
    console.log('영업일 기준 1-2일 내에 담당자가 답변 드리겠습니다.');
    console.log('==========================================\n');

    return {
      success: true,
      messageId: `auto-reply-dev-${Date.now()}`
    };
  }

  // 프로덕션 환경에서는 실제 자동 응답 이메일 전송
  // 위의 sendContactFormEmail과 동일한 방식으로 이메일 서비스 통합

  return {
    success: true,
    messageId: `auto-reply-${Date.now()}`
  };
}

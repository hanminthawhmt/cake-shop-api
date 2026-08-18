/**
 * Base email template for Petal & Cocoa
 * Generates a branded email wrapper with header and footer
 * Uses table-based layout for maximum email client compatibility
 * All CSS is inline to work across all email clients
 */

interface EmailTemplateOptions {
  title: string;
  body: string;
  buttonText?: string;
  buttonUrl?: string;
}

export function generateEmailTemplate(options: EmailTemplateOptions): string {
  const { title, body, buttonText, buttonUrl } = options;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <!-- Wrapper table -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F6;">
      <tr>
        <td align="center" style="padding: 20px;">
          <!-- Content container -->
          <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #D4A5A0 0%, #A67C7B 100%); padding: 40px 20px; text-align: center;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="text-align: center;">
                      <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 600;">🎂 Petal & Cocoa</h1>
                      <p style="margin: 8px 0 0 0; color: #F5D6D0; font-size: 13px; letter-spacing: 1px;">ARTISAN CAKE & LOUNGE</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title section -->
            <tr>
              <td style="padding: 30px 20px 20px 20px; border-bottom: 3px solid #E8D4CE;">
                <h2 style="margin: 0; color: #8B5A5A; font-size: 24px; font-weight: 600; text-align: center;">
                  ${title}
                </h2>
              </td>
            </tr>

            <!-- Body content -->
            <tr>
              <td style="padding: 30px 20px;">
                ${body}
              </td>
            </tr>

            ${
              buttonText && buttonUrl
                ? `
            <!-- CTA Button -->
            <tr>
              <td style="padding: 0 20px 30px 20px; text-align: center;">
                <a href="${buttonUrl}" style="display: inline-block; background-color: #D4A5A0; color: #FFFFFF; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
                  ${buttonText}
                </a>
              </td>
            </tr>
            `
                : ''
            }

            <!-- Footer -->
            <tr>
              <td style="background-color: #FAF8F6; padding: 20px; text-align: center; border-top: 1px solid #E8D4CE;">
                <p style="margin: 0 0 10px 0; color: #8B5A5A; font-size: 12px; line-height: 1.6;">
                  Thank you for choosing Petal & Cocoa.<br>
                  For support, contact us at <a href="mailto:hello@petalcocoa.com" style="color: #D4A5A0; text-decoration: none;">hello@petalcocoa.com</a>
                </p>
                <p style="margin: 10px 0 0 0; color: #A67C7B; font-size: 11px;">
                  © 2026 Petal & Cocoa. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Helper to wrap body content in proper paragraph styling
 * Ensures consistent line height and text color across all emails
 */
export function bodyParagraph(text: string): string {
  return `<p style="margin: 0 0 15px 0; color: #5C4A48; font-size: 15px; line-height: 1.6;">${text}</p>`;
}

/**
 * Helper for order/reservation details sections
 * Creates a styled details box with better visual separation
 */
export function detailsBox(content: string): string {
  return `<table width="100%" border="0" cellpadding="15" cellspacing="0" style="background-color: #FAF8F6; border-left: 4px solid #D4A5A0; margin: 20px 0;">
    <tr>
      <td style="color: #5C4A48; font-size: 14px; line-height: 1.8;">
        ${content}
      </td>
    </tr>
  </table>`;
}

/**
 * Helper for list items (order items, reservation details, etc.)
 */
export function listItem(label: string, value: string): string {
  return `<div style="margin: 8px 0; color: #5C4A48; font-size: 14px;">
    <span style="font-weight: 600; color: #8B5A5A;">${label}</span>
    <span style="color: #5C4A48;">${value}</span>
  </div>`;
}

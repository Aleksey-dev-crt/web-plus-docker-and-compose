import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class EmailSenderService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(wish: Wish, emails: string[]) {
    return this.mailerService.sendMail({
      from: this.configService.get<string>('EMAIL_LOGIN'),
      to: emails,
      subject: 'Можете получить свой подарок!',
      text: `Собрали денег на желаемый Вами подарок`,
      html: `
      <div>
        <a href="${wish.link}">
          <img src="${wish.image}" alt="изображение подарка">
        </a>
      </div>
      <p>Адреса тех, кто скинулся Вам на подарок: ${emails.join('; ')}</p>        
    `,
    });
  }
}

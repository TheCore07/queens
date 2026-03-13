import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl border border-border/50 max-w-3xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <Lock className="text-primary" size={32} />
                {t('legal.privacyPolicy')}
            </h2>

            <div className="space-y-8 text-sm leading-relaxed">
                <section>
                    <h3 className="text-lg font-bold mb-3">{t('legal.p1_title')}</h3>
                    <p>
                        {t('legal.p1_text')}
                    </p>
                </section>

                <hr className="border-border/50" />

                <section>
                    <h3 className="text-lg font-bold mb-3">{t('legal.p2_title')}</h3>
                    <p>{t('legal.p2_text')}</p>
                    <p className="mt-4">
                        Fabian Altaner<br />
                        Ihmer Straße 2b<br />
                        30966 Hemmingen<br />
                        {t('legal.germany')}<br /><br />
                        E-Mail: fabianaltaner@gmail.com
                    </p>
                </section>

                <hr className="border-border/50" />

                <section className="space-y-6">
                    <h3 className="text-lg font-bold mb-1">{t('legal.p3_title')}</h3>
                    
                    <div>
                        <h4 className="font-bold mb-2">{t('legal.p3_reg_title')}</h4>
                        <p>{t('legal.p3_reg_text1')}</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>{t('legal.p3_reg_li1')}</li>
                            <li>{t('legal.p3_reg_li2')}</li>
                            <li>{t('legal.p3_reg_li3')}</li>
                            <li>{t('legal.p3_reg_li4')}</li>
                            <li>{t('legal.p3_reg_li5')}</li>
                        </ul>
                        <p className="mt-3">{t('legal.p3_reg_text2')}</p>
                        <p className="mt-2 italic">{t('legal.p3_reg_basis')}</p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">{t('legal.p3_game_title')}</h4>
                        <p>{t('legal.p3_game_text')}</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>{t('legal.p3_game_li1')}</li>
                            <li>{t('legal.p3_game_li2')}</li>
                            <li>{t('legal.p3_game_li3')}</li>
                        </ul>
                        <p className="mt-3">{t('legal.p3_game_purpose')}</p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">{t('legal.p3_feedback_title')}</h4>
                        <p>{t('legal.p3_feedback_text')}</p>
                        <p className="mt-2 italic">{t('legal.p3_feedback_basis')}</p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">{t('legal.p3_cookies_title')}</h4>
                        <p>{t('legal.p3_cookies_text')}</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>{t('legal.p3_cookies_li1')}</li>
                            <li>{t('legal.p3_cookies_li2')}</li>
                        </ul>
                        <p className="mt-2 italic">{t('legal.p3_cookies_basis')}</p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">{t('legal.p3_hosting_title')}</h4>
                        <p>{t('legal.p3_hosting_text')}</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>{t('legal.p3_hosting_li1')}</li>
                            <li>{t('legal.p3_hosting_li2')}</li>
                        </ul>
                        <p className="mt-2 italic">{t('legal.p3_hosting_basis')}</p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">{t('legal.p3_analytics_title')}</h4>
                        <p>{t('legal.p3_analytics_text')}</p>
                        <p className="mt-2 italic">{t('legal.p3_analytics_basis')}</p>
                    </div>
                </section>

                <hr className="border-border/50" />

                <section>
                    <h3 className="text-lg font-bold mb-3">{t('legal.p4_title')}</h3>
                    <p>
                        {t('legal.p4_text')}
                    </p>
                </section>

                <hr className="border-border/50" />

                <section>
                    <h3 className="text-lg font-bold mb-3">{t('legal.p5_title')}</h3>
                    <p>{t('legal.p5_text')}</p>
                </section>

                <hr className="border-border/50" />

                <section>
                    <h3 className="text-lg font-bold mb-3">{t('legal.p6_title')}</h3>
                    <p>{t('legal.p6_text')}</p>
                </section>

                <hr className="border-border/50" />

                <section>
                    <h3 className="text-lg font-bold mb-3">{t('legal.p7_title')}</h3>
                    <p>{t('legal.p7_text')}</p>
                </section>
            </div>
        </div>
    );
}

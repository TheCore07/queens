import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LegalNotice() {
    const { t } = useTranslation();
    
    return (
        <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl border border-border/50 max-w-3xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <ShieldCheck className="text-primary" size={32} />
                {t('legal.notice')}
            </h2>

            <div className="space-y-6 text-sm leading-relaxed">
                <section>
                    <h3 className="text-lg font-bold mb-2">{t('legal.addressTitle')}</h3>
                    <p>
                        Fabian Altaner<br />
                        Ihmer Straße 2b<br />
                        30966 Hemmingen<br />
                        {t('legal.germany')}
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">{t('legal.contact')}</h3>
                    <p>
                        E-Mail: fabianaltaner@gmail.com
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">{t('legal.dispute')}</h3>
                    <p>
                        {t('legal.disputeText')}
                    </p>
                </section>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function Confirmation() {
  const [email, setEmail] = useState<string>('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Récupérer l'email depuis l'URL ou localStorage
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get('email');
    const storedEmail = localStorage.getItem('pendingEmail');
    
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      localStorage.setItem('pendingEmail', emailFromUrl);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error('Erreur renvoi email:', err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-white">Vérifie ta boîte mail ! 🎮</CardTitle>
          <CardDescription className="text-slate-300">
            Un email de confirmation a été envoyé
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Email envoyé à :</p>
            <p className="text-white font-medium break-all">{email || 'ton adresse email'}</p>
          </div>

          <div className="space-y-4 text-slate-300 text-sm">
            <p>
              Clique sur le lien de confirmation dans l'email pour activer ton compte.
            </p>
            <p className="text-amber-400">
              💡 Pense à vérifier ton dossier <strong>Spam</strong> ou <strong>Indésirables</strong> !
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              disabled={resendLoading || !email}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {resendLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {resendSuccess ? 'Email renvoyé !' : 'Renvoyer l\'email'}
            </Button>

            <Button
              onClick={() => window.location.href = '/'}
              variant="ghost"
              className="w-full text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
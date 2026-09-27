import React, { useState, useEffect } from 'react';

interface HostUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface RegistrationFormData {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  host_id: number | null;
  purpose_of_visit: string;
  safety_instructions_signed: boolean;
  nda_accepted: boolean;
}

const API_BASE_URL = 'http://localhost:8000/api';

export default function KioskRegistration() {
  const [step, setStep] = useState<number>(1);
  const [hosts, setHosts] = useState<HostUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegistrationFormData>({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    host_id: null,
    purpose_of_visit: 'Réunion de travail',
    safety_instructions_signed: false,
    nda_accepted: false,
  });

  // Charger la liste des hôtes (employés) pour la sélection
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/`);
        if (res.ok) {
          const data = await res.json();
          setHosts(data);
        }
      } catch (err) {
        console.error('Erreur chargement hôtes', err);
      }
    };
    fetchHosts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.safety_instructions_signed || !formData.nda_accepted) {
      setError('Vous devez accepter les consignes de sécurité et le NDA pour continuer.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Enregistrement ou récupération du visiteur
      const visitorRes = await fetch(`${API_BASE_URL}/visitors/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          company: formData.company,
        }),
      });

      if (!visitorRes.ok) throw new Error("Échec de l'enregistrement des coordonnées.");
      const visitorData = await visitorRes.json();

      // 2. Création de la visite
      const visitRes = await fetch(`${API_BASE_URL}/visits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor: visitorData.id,
          host: formData.host_id,
          purpose_of_visit: formData.purpose_of_visit,
          safety_instructions_signed: formData.safety_instructions_signed,
          nda_accepted: formData.nda_accepted,
          status: 'CHECKED_IN', // Check-in automatique à l'inscription borne
        }),
      });

      if (!visitRes.ok) throw new Error("Échec de la validation de la visite.");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      company: '',
      host_id: null,
      purpose_of_visit: 'Réunion de travail',
      safety_instructions_signed: false,
      nda_accepted: false,
    });
    setStep(1);
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center">
        <div className="bg-slate-800 p-10 rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl">
            ✓
          </div>
          <h2 className="text-3xl font-bold">Bienvenue !</h2>
          <p className="text-slate-300">
            Votre arrivée a été enregistrée. Votre hôte a été prévenu de votre présence.
          </p>
          <button
            onClick={resetForm}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold text-lg transition"
          >
            Terminer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="bg-slate-800 max-w-2xl w-full rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-700 w-full">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/50 text-rose-300 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Étape 1 : Vos Informations */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Bienvenue, qui êtes-vous ?</h2>
                <p className="text-slate-400 text-sm">Saisissez vos informations personnelles</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">Prénom</label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">Nom</label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">Adresse Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">Société / Entreprise</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.first_name || !formData.last_name || !formData.email}
                className="w-full py-4 bg-indigo-600 disabled:bg-slate-700 hover:bg-indigo-500 rounded-xl font-semibold transition"
              >
                Suivant : Motif et Hôte
              </button>
            </div>
          )}

          {/* Étape 2 : Motif et Hôte */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Qui venez-vous voir ?</h2>
                <p className="text-slate-400 text-sm">Sélectionnez la personne à contacter</p>
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">Personne visitée (Hôte)</label>
                <select
                  name="host_id"
                  required
                  value={formData.host_id || ''}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-slate-100"
                >
                  <option value="">Sélectionnez un employé...</option>
                  {hosts.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.first_name} {h.last_name} ({h.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-400 font-semibold mb-2">Motif de la visite</label>
                <input
                  type="text"
                  name="purpose_of_visit"
                  value={formData.purpose_of_visit}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.host_id}
                  className="w-1/2 py-4 bg-indigo-600 disabled:bg-slate-700 hover:bg-indigo-500 rounded-xl font-semibold transition"
                >
                  Suivant : Reglement
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 : Documents et Validation */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Consignes & Confidentialité</h2>
                <p className="text-slate-400 text-sm">Veuillez accepter les règles de sécurité</p>
              </div>
              <div className="space-y-4 bg-slate-900 p-6 rounded-2xl border border-slate-700">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="safety_instructions_signed"
                    checked={formData.safety_instructions_signed}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 accent-indigo-500"
                  />
                  <span className="text-sm text-slate-300">
                    J'ai pris connaissance des consignes d'évacuation et de sécurité du bâtiment.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="nda_accepted"
                    checked={formData.nda_accepted}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 accent-indigo-500"
                  />
                  <span className="text-sm text-slate-300">
                    J'accepte l'accord de confidentialité (NDA) relatif aux informations vues sur site.
                  </span>
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/2 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.safety_instructions_signed || !formData.nda_accepted}
                  className="w-1/2 py-4 bg-emerald-600 disabled:bg-slate-700 hover:bg-emerald-500 rounded-xl font-semibold transition"
                >
                  {loading ? 'Validation...' : 'Valider mon Arrivée'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
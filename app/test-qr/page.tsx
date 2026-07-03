import QrCodeDisplay from "@/components/QrCodeDisplay";

export default function TestQrPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black p-4">
      <div className="text-center mb-8">
        <h1 className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent mb-2">
          QR Code Generator Test
        </h1>
        <p className="text-gray-400 text-sm">Standalone component test for location "test-location-id"</p>
      </div>
      
      <QrCodeDisplay locationId="test-location-id" />
    </main>
  );
}

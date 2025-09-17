import Image from "next/image";

export default function HomeScreen() {
  return (
    <div className="flex flex-col w-screen h-screen bg-[url('/back.png')] bg-[#0F1E7A] bg-center bg-cover bg-blend-soft-light justify-center items-center gap-3">
      <Image src="/daystar_logo.png" alt="daystar-logo" width={60} height={40} className="object-cover" />
      <p className="text-5xl text-white font-bold">requisite</p>
      <p className="text-xl text-white font-medium">Vendor Platform</p>
    </div>
  );
}

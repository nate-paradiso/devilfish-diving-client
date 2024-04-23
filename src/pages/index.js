// import { PayPal } from "../components/paypal";

import Hero from "../components/Hero";

export default function Home() {
  return (
    <main>
      {/* <PayPal /> */}
      <Hero />
      <section className="flex justify-center items-center flex-col">
        <div className="bg-lightBlue">
          <h2 className="m-8 text-xl">Serving Marine Area 10 </h2>
        </div>
        <div className="flex justify-evenly flex flex-wrap m-4">
          <div>
            <img className="w-16 m-2" src="/images/scuba.svg" alt="Scuba Tanks" />
            <img className="w-16 m-2" src="/images/diving.svg" alt="Scuba Tanks" />
          </div>
          <div>
            <img className="w-16 m-2" src="/images/anchor.svg" alt="Anchor" />
            <img className="w-16 m-2" src="/images/life.svg" alt="Life Ring" />
          </div>
          <div>
            <img className="w-16 m-2" src="/images/whale.svg" alt="Whale" />
            <img className="w-16 m-2" src="/images/sunset.svg" alt="Sunset" />
          </div>
        </div>
      </section>
    </main>
  );
}

// import { PayPal } from "../components/paypal";

import Hero from "../components/Hero";

export default function Home() {
  return (
    <main>
      {/* <PayPal /> */}
      <Hero />
      <section className="flex justify-center items-center flex-col">
        {/* Use Tailwind CSS for background image and opacity */}
        <div className="">
          <h2 className="m-8 text-xl color-white">Serving Marine Area 10 </h2>
        </div>
        <div
          className="bg-cover bg-center w-full flex justify-center align-middle"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/MA10-1.png')`, // Add linear gradient with desired opacity,
          }}
        >
          <div className=" justify-evenly flex flex-wrap align-middle m-4">
            <div className="flex justify-evenly flex-col">
              <img className="w-16 m-2" src="/images/scuba.png" alt="Mask" />
              <img className="w-16 m-2" src="/images/diving (1).png" alt="Scuba Tanks" />
            </div>
            <div className="flex justify-evenly flex-col">
              <img className="w-16 m-2" src="/images/boat.png" alt="Boat" />
              <img className="w-16 m-2" src="/images/life.png" alt="Life Ring" />
            </div>
            <div className="flex justify-evenly flex-col">
              <img className="w-16 m-2" src="/images/camera.png" alt="Camera" />
              <img className="w-16 m-2" src="/images/fins.png" alt="Fins" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

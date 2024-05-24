import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="flex  flex-col justify-center items-center m-8">
      <h1 className="text-3xl m-4 text-center">404 - Page Not Found</h1>
      <Image src={"/images/lost-diver.png"} alt="lost diver" width={200} height={200} />
    </div>
  );
};

export default NotFoundPage;

const EnrollmentComponent = () => {
  return (
    <>
      <div className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Enrollment
      </div>
      <div className={`grid grid-cols-3 gap-0 p-4`}>
        <div className="col-span-4 border border-gray-300 p-2 text-center text-gradient-red font-bold text-2xl mt-10">
          Sorry Currenly Enrollment prosess is not Enabled !!
        </div>
      </div>
    </>
  );
};

export default EnrollmentComponent;

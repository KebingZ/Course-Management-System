import { Steps } from "antd";
import React, { useState } from "react";


import FirstStep from "../component/courseStep1";
import SecondStep from "../component/courseStep2";
import ThirdPage from "../component/courseStep3";

const { Step } = Steps;

const AddCourse = () => {
const [currentStep, setCurrentStep] = useState(0);
  const [courseId, setCourseId] = useState();
  const [step2Param, setStep2Param] = useState();


  const steps = [
    {
      title: "Course Detail",
      content: (
        <FirstStep
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setStep2Param={setStep2Param}
          setCourseId={setCourseId}
          isEdit={false}
        />
      ),
    },
    {
      title: "Course Schedule",
      content: (
        <SecondStep
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          step2Param={step2Param}
          isEdit={false}
        />
      ),
    },
    {
      title: "Success",
      content: <ThirdPage courseId={courseId} />,
    },
  ];
 
  return (
    <div>
      <Steps current={currentStep} type="navigation">
        {steps.map((item) => (
          <Step
            key={item.title}
            title={item.title}
            onClick={() =>
              steps.indexOf(item) < currentStep
                ? setCurrentStep(steps.indexOf(item))
                : null
            }
          ></Step>
        ))}
      </Steps>
      {steps[currentStep].content}
    </div>
  );
};

export default AddCourse;

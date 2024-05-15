import React from "react";

const LiabilityRelease = ({ formData }) => {
  return (
    <section className="mb-2">
      {" "}
      <h2 className="text-xl mb-2">Liability Release and Assumption of Risk Agreement</h2>
      <p>
        I,{" "}
        <span className="font-bold text-xl text-green-500">
          {formData.firstName} {formData.lastName}
        </span>
        , hereby affirm that I am participating in a pleasure cruise organized by Devilfish Diving
        LLC. I understand that cruising involves inherent risks, including those associated with
        boat travel, which may result in injury or death. I acknowledge that the cruise may include
        risks such as slipping or falling while on board the boat, being cut or struck by a boat
        while in the water, injuries occurring while getting on or off the boat, and other perils of
        the sea. I still choose to proceed with the cruise in spite of these risks..
      </p>
      <br />
      <p>
        I understand and agree that neither
        <span className="font-bold text-lg"> Devilfish Diving LLC</span> nor any of their affiliate
        and subsidiary corporations, nor any of their respective employees, officers, agents,
        contractors, and assigns (hereinafter referred to as "Released Parties") may be held liable
        or responsible in any way for any injury, death, or other damages that may occur during the
        cruise as a result of my participation or as a result of the negligence of any party,
        including the Released Parties, whether passive or active.
      </p>
      <br />
      <p>
        I affirm that I am in good mental and physical health for the cruise. I further state that I
        will not participate in the cruise if I am under the influence of alcohol or any drugs. If I
        am taking medication, I affirm that I have seen a physician and have approval to participate
        while under the influence of the medication/drugs. I understand that cruising may involve
        physical activity and that I will take appropriate precautions to ensure my safety.
      </p>
      <br />
      <p>
        I acknowledge that safe practices suggest following the instructions provided by the boat
        crew and maintaining appropriate behavior while on board. I will not hold the Released
        Parties responsible for any failure to follow instructions or for any injury resulting from
        my actions.
      </p>
      <br />
      <p>
        I understand that cruising may involve risks associated with being on the water and that I
        will take appropriate precautions to ensure my safety. I acknowledge that the cruise will be
        conducted in locations where emergency medical assistance may be limited. I still choose to
        proceed with the cruise in spite of these limitations.
      </p>
      <br />
      <p>
        I affirm that I have read, understand, and agree to the terms of this liability release and
        assumption of risk agreement. By typing my name below, I acknowledge that I am
        electronically signing this agreement and waiving my legal rights.
      </p>
      <br />
      <p>
        {" "}
        I,{" "}
        <span className="font-bold text-xl text-green-500">
          {formData.firstName} {formData.lastName}
        </span>
        , BY THIS INSTRUMENT, AGREE TO EXEMPT AND RELEASE THE RELEASED PARTIES DEFINED ABOVE FROM
        ALL LIABILITY OR RESPONSIBILITY WHATSOEVER FOR PERSONAL INJURY, PROPERTY DAMAGE OR WRONGFUL
        DEATH HOWEVER CAUSED, INCLUDING BUT NOT LIMITED TO THE NEGLIGENCE OF THE RELEASED PARTIES,
        WHETHER PASSIVE OR ACTIVE.
      </p>
      <br />
      <p>
        I HAVE FULLY INFORMED MYSELF AND MY HEIRS OF THE CONTENTS OF THIS NON-AGENCY DISCLOSURE AND
        ACKNOWLEDGMENT AGREEMENT, AND LIABILITY RELEASE AND ASSUMPTION OF RISK AGREEMENT BY READING
        BOTH BEFORE SIGNING BELOW ON BEHALF OF MYSELF AND MY HEIRS
      </p>
      <br />
    </section>
  );
};

export default LiabilityRelease;

/**
 * Process a declation accident
 * @param {jayesh_insurance_blockchain_claim_process_network.claims.DeclareClaim} declarationClaim 
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function onDeclarationClaim(declarationClaim) {
    console.log('### onDeclarationClaim ' + declarationClaim.toString());
    declarationClaim.submitclaim.sent = true;
    var balanceInsurancecompanyInitial =  declarationClaim.insurancecompany.Balance;
    declarationClaim.claimer.Balance = declarationClaim.claimer.Balance + declarationClaim.submitclaim.Amount;
    declarationClaim.insurancecompany.Balance = declarationClaim.insurancecompany.Balance - declarationClaim.submitclaim.Amount;

    return getParticipantRegistry('jayesh_insurance_blockchain_claim_process_network.claims.Insurancecompany')
    .then(function (insurancecompanyRegistry) {
        // update the Claimer balance
        return insurancecompanyRegistry.update(declarationClaim.insurancecompany);
    })
    .then(function () {
        return getParticipantRegistry('jayesh_insurance_blockchain_claim_process_network.claims.Claimer');
    })
    .then(function (claimerRegistry) {
        // update the Claimer balance
        return claimerRegistry.update(declarationClaim.claimer);
    })
    .then(function () {
        return getAssetRegistry('jayesh_insurance_blockchain_claim_process_network.claims.Submitclaim');
    })
    .then(function (submitclaimRegistry) {
        // update the state of the Accident
        return submitclaimRegistry.update(declarationClaim.submitclaim);
    })
    .then(function () {
        // Emit an event for the modified asset.
        var event = getFactory().newEvent('jayesh_insurance_blockchain_claim_process_network.claims', 'DeclarationClaimEvent');
        event.submitclaim = declarationClaim.submitclaim;
        event.balanceInsurancecompanyInitial = balanceInsurancecompanyInitial;
        event.balanceInsurancecompanyFinal = declarationClaim.insurancecompany.Balance;
        emit(event);
    });
}

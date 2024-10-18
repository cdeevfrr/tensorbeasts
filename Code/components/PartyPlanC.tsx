import { BeastPartyLocation, PartyPlan, recheckSizes } from "@/Game/Beasts/PartyPlan";
import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BeastRowC } from "./BeastRowC";
import { Beast } from "@/Game/Beasts/Beast";
import { BoxModal } from "./BoxModal";

export default function PartyPlanC({
    party,
    setParty,
    box,
    editable = true,
}: {
    party: PartyPlan,
    setParty? : (partyPlan: PartyPlan) => void, // required if editable
    box?: Array<Beast> // required if editable
    editable?: boolean,
}) {
    const [beastLocation, setBeastLocation] = useState<BeastPartyLocation>({
        array: 'support',
        index: 0
    })
    const [showBox, setShowBox] = useState(false)

    const vanguardUUIDs = party.vanguard.map(b => b && b.uuid)
    const coreUUIDs = party.core.map(b => b && b.uuid)
    const supportUUIDs = party.support.map(b => b && b.uuid)
    const filteredBox = box?.filter((beast) => {
        return !vanguardUUIDs.includes(beast.uuid) &&
        !coreUUIDs.includes(beast.uuid) &&
        !supportUUIDs.includes(beast.uuid)
    })

    if (editable && !box){
        throw new Error("Must provide a box when party plan component is editable.")
    }
    if (editable && !setParty){
        throw new Error("Must provide a setParty callback when party plan component is editable.")
    }

    return (
      <View style={styles.container}>
        {editable && filteredBox && setParty && <BoxModal
          box={filteredBox}
          onRequestClose={() => {
            setShowBox(false)
          }}
          onSelect={(beast: Beast | null ) => {
            party[beastLocation.array][beastLocation.index] = beast
            const newParty = recheckSizes(party)
            setParty(newParty)
            setShowBox(false)
          }}
          visible={showBox}
          canSelectNull={
            party[beastLocation.array][beastLocation.index] != null
          }
        />}
        <BeastRowC beasts={party.vanguard} beastClickCallback={editable? (beast) => {
            setShowBox(true)
            setBeastLocation({
                array: 'vanguard',
                index: party.vanguard.indexOf(beast)
            })
        }: () => {}}/>
        <BeastRowC beasts={party.core} beastClickCallback={editable? (beast) => {
            setShowBox(true)
            setBeastLocation({
                array: 'core',
                index: party.core.indexOf(beast)
            })
        }: () => {}}/>
        <BeastRowC beasts={party.support} beastClickCallback={editable? (beast) => {
            setShowBox(true)
            setBeastLocation({
                array: 'support',
                index: party.support.indexOf(beast)
            })
        }: () => {}}/>
      </View>
    );
  }

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
},
text: {
    color: '#fff',
},
});

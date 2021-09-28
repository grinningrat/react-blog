import {useState, useEffect} from 'react';
import { Form, Button, Alert, Modal, InputGroup, FormControl } from 'react-bootstrap';
import Dice from 'dice-notation-js';
import { MODIFIERS, TYPES, ATTACK_DEFAULTS } from './constants';

export default function AttackModal({
  showAttackModal,
  handleAttackClose,
  handleAddAttack,
  editIndex,
  initialValues
}) {
  const [attackName, setAttackName] = useState(initialValues.attackName);
  const [attackBonus, setAttackBonus] = useState(initialValues.attackBonus);
  const [targetAc, setTargetAc] = useState(initialValues.targetAc);
  const [attackDamage, setAttackDamage] = useState(initialValues.attackDamage);
  const [modifier, setModifier] = useState(initialValues.modifier);
  const [numberOfAttacks, setNumberOfAttacks] = useState(initialValues.numberOfAttacks);
  const [critChance, setCritChance] = useState(initialValues.critChance);
  const [attackResult, setAttackResult] = useState(null);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const setValues = resultObj => {
    setAttackName(resultObj.attackName);
    setAttackBonus(resultObj.attackBonus);
    setTargetAc(resultObj.targetAc);
    setAttackDamage(resultObj.attackDamage);
    setModifier(resultObj.modifier);
    setNumberOfAttacks(resultObj.numberOfAttacks);
    setCritChance(resultObj.critChance);
  };

  const calculateAttack = () => {
    let chanceToHit = (21 + parseInt(attackBonus) - parseInt(targetAc)) / 20;
    switch (modifier) {
      case MODIFIERS.DISADVANTAGE:
        // Disadvantage is calculated by both attacks hitting
        chanceToHit = Math.pow(chanceToHit, 2);
        break;
      case MODIFIERS.ADVANTAGE:
        // Advantage is calculated by both attacks NOT missing
        chanceToHit = 1 - Math.pow((1 - chanceToHit), 2);
        break;
      case MODIFIERS.DOUBLE_ADVANTAGE:
        // Similarly double advantage is the chance of all 3 attacks mising
        chanceToHit = 1 - Math.pow((1 - chanceToHit), 3);
        break;
      default:
        break;
    }

    const damageDice = Dice.parse(attackDamage);
    const averageDamageRoll = damageDice.number * ((damageDice.type + 1) / 2) + damageDice.modifier;
    const averageDamage = chanceToHit * averageDamageRoll;
    const critBonus = parseFloat(critChance) * (damageDice.number * ((damageDice.type + 1) / 2));
    return {
      type: TYPES.ATTACK,
      attackName,
      attackBonus,
      targetAc,
      attackDamage,
      modifier,
      critChance,
      chanceToHit: Math.round(chanceToHit * 100) / 100,
      averageDamage: Math.round((averageDamage + critBonus) * 100) / 100,
      numberOfAttacks: parseInt(numberOfAttacks)
    };
  };

  const handleAnalyzeAttack = event => {
    event.preventDefault();
    setAttackResult(calculateAttack());
  };

  const onAddClicked = () => {
    setValues(ATTACK_DEFAULTS);
    handleAddAttack(calculateAttack(), editIndex);
  }

  return (<Modal centered show={showAttackModal} onHide={handleAttackClose}>
    <Modal.Header closeButton>
      <Modal.Title>Add Attack</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <InputGroup className="mb-3" controlId="formAttackName">
        <InputGroup.Text>Attack Name</InputGroup.Text>
        <FormControl
          type="text"
          value={attackName}
          onChange={(event) => setAttackName(event.target.value)} 
          placeholder="Enter Name (optional)" />
      </InputGroup>
      <InputGroup className="mb-3" controlId="formAttackBonus">
        <InputGroup.Text>Attack Bonus</InputGroup.Text>
        <FormControl
          type="text"
          value={attackBonus}
          onChange={(event) => setAttackBonus(event.target.value)} 
          placeholder="Enter bonus" />
        <InputGroup.Text className="text-muted">
          Specify + or -
        </InputGroup.Text>
      </InputGroup>
      <InputGroup className="mb-3" controlId="formAttackDamage">
        <InputGroup.Text>Attack Damage</InputGroup.Text>
        <FormControl
          type="text"
          value={attackDamage}
          onChange={(event) => setAttackDamage(event.target.value)} 
          placeholder="Enter damage" />
      </InputGroup>
      <InputGroup className="mb-3" controlId="formAttackBonus">
        <InputGroup.Text>Target AC</InputGroup.Text>
        <FormControl
          type="text"
          value={targetAc}
          onChange={(event) => setTargetAc(event.target.value)}
          placeholder="Enter AC" />
      </InputGroup>
      <InputGroup className="mb-3" controlId="formAdvantageRadio" value={modifier}>
        <Form.Check inline
          id='attackDisadvantage'
          name="advantageGroup"
          type="radio"
          value={MODIFIERS.DISADVANTAGE}
          onChange={() => setModifier(MODIFIERS.DISADVANTAGE)}
          label="Disadvantage" />
        <Form.Check inline
          id='attackNormal'
          name="advantageGroup"
          type="radio"
          value={MODIFIERS.NORMAL}
          defaultChecked
          onChange={() => setModifier(MODIFIERS.NORMAL)}
          label="No Advantage" />
        <Form.Check inline
          id='attackAdvantage'
          name="advantageGroup"
          type="radio"
          value={MODIFIERS.ADVANTAGE}
          onChange={() => setModifier(MODIFIERS.ADVANTAGE)}
          label="Advantage" />
        <Form.Check inline
          id='attackDAdvantage'
          name="advantageGroup"
          type="radio"
          value={MODIFIERS.DOUBLE_ADVANTAGE}
          onChange={() => setModifier(MODIFIERS.DOUBLE_ADVANTAGE)}
          label="Double Advantage" />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>Number of Attacks</InputGroup.Text>
        <FormControl
          type="text"
          value={numberOfAttacks}
          onChange={(event) => setNumberOfAttacks(event.target.value)} 
          placeholder="Enter number of attacks" />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>Critical Chance</InputGroup.Text>
        <FormControl
          type="text"
          value={critChance}
          onChange={(event) => setCritChance(event.target.value)} 
          placeholder="Enter Critical Chance" />
      </InputGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleAnalyzeAttack}>
        Analyze
      </Button>
      <Button variant="primary" onClick={onAddClicked}>
        Add
      </Button>
    </Modal.Footer>
  </Modal>);
};
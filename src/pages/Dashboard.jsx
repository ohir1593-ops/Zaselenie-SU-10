import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  subscribeCorpuses,
  subscribeUnits,
  createCorpus,
  renameCorpus,
  deleteCorpus,
  addUnit,
  updateUnit,
  deleteUnit,
  deleteFloor,
  ensureProjectExists
} from '../lib/firestoreApi';
import ChessBoard from '../components/ChessBoard';
import CorpusStatsBlock from '../components/CorpusStatsBlock';
import FiltersBar from '../components/FiltersBar';
import UnitModal from '../components/UnitModal';
import StatsPage from './StatsPage';
import StructurePage from './StructurePage';
import UsersPage from './UsersPage';

// В этой версии используется один проект по умолчанию.
// При необходимости можно расширить до выбора между несколькими ЖК.
const PROJECT_ID = 'default-project';
const PROJECT_NAME = 'Основной объект';

export default function Dashboard() {
  const { profile, isAdmin, logout, firebaseUser } = useAuth();

  const [corpuses, setCorpuses] = useState([]);
  const [units, setUnits] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [tab, setTab] = useState('board'); // board | stats | structure | users
  const [activeCorpusId, setActiveCorpusId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    ensureProjectExists(PROJECT_ID, PROJECT_NAME);
    const unsubC = subscribeCorpuses(PROJECT_ID, (items) => {
      setCorpuses(items);
      setLoadingData(false);
      setActiveCorpusId((prev) => prev || (items[0] && items[0].id) || null);
    });
    const unsubU = subscribeUnits(PROJECT_ID, setUnits);
    return () => {
      unsubC();
      unsubU();
    };
  }, []);

  const activeCorpus = corpuses.find((c) => c.id === activeCorpusId);

  const corpusUnits = useMemo(
    () => units.filter((u) => u.corpusId === activeCorpusId),
    [units, activeCorpusId]
  );

  const filteredUnits = useMemo(() => {
    return corpusUnits.filter((u) => {
      if (filterStatus !== 'all' && u.status !== filterStatus) return false;
      if (filterType !== 'all' && u.type !== filterType) return false;
      if (search && !String(u.num).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [corpusUnits, filterStatus, filterType, search]);

  const corpusProgress = useMemo(() => {
    const map = {};
    corpuses.forEach((c) => {
      const us = units.filter((u) => u.corpusId === c.id);
      const done = us.filter((u) => u.status === 'done_clean' || u.status === 'done_issues').length;
      map[c.id] = { total: us.length, done };
    });
    return map;
  }, [units, corpuses]);

  // --- handlers ---
  async function handleAddCorpus(name) {
    const ref = await createCorpus(PROJECT_ID, name);
    setActiveCorpusId(ref.id);
  }
  async function handleRenameCorpus(corpusId, name) {
    await renameCorpus(PROJECT_ID, corpusId, name);
  }
  async function handleDeleteCorpus(corpusId) {
    await deleteCorpus(PROJECT_ID, corpusId);
    if (activeCorpusId === corpusId) {
      const remaining = corpuses.filter((c) => c.id !== corpusId);
      setActiveCorpusId(remaining[0]?.id || null);
    }
  }
  async function handleAddFloor(corpusId) {
    const existing = units.filter((u) => u.corpusId === corpusId && u.floor !== '-');
    const maxFloor = existing.length ? Math.max(...existing.map((u) => u.floor)) : 0;
    const newFloor = maxFloor + 1;
    for (let n = 1; n <= 4; n++) {
      await addUnit(PROJECT_ID, { corpusId, floor: newFloor, num: newFloor * 100 + n, type: 'flat' });
    }
  }
  async function handleDeleteFloor(corpusId, floor) {
    await deleteFloor(PROJECT_ID, corpusId, floor);
  }
  async function handleAddUnitFromStructure(corpusId, floor, num, type) {
    await addUnit(PROJECT_ID, { corpusId, floor, num, type });
  }
  async function handleUpdateUnit(unitId, patch) {
    await updateUnit(PROJECT_ID, unitId, patch);
  }
  async function handleDeleteUnit(unitId) {
    await deleteUnit(PROJECT_ID, unitId);
  }

  if (loadingData) {
    return <div className="loading-screen">Загрузка данных…</div>;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <button className="hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Меню">☰</button>
          <h1 className="app-title">Шахматка объектов</h1>
        </div>
        <div className="app-header-right">
          <span className="role-badge">{isAdmin ? 'Администратор' : 'Пользователь'}</span>
          <button className="icon-btn" onClick={logout} aria-label="Выйти" title="Выйти">⏻</button>
        </div>
      </header>

      <nav className={`app-tabs ${menuOpen ? 'open' : ''}`}>
        <button className={tab === 'board' ? 'active' : ''} onClick={() => { setTab('board'); setMenuOpen(false); }}>
          Шахматка
        </button>
        <button className={tab === 'stats' ? 'active' : ''} onClick={() => { setTab('stats'); setMenuOpen(false); }}>
          Статистика
        </button>
        {isAdmin && (
          <>
            <button className={tab === 'structure' ? 'active' : ''} onClick={() => { setTab('structure'); setMenuOpen(false); }}>
              Структура
            </button>
            <button className={tab === 'users' ? 'active' : ''} onClick={() => { setTab('users'); setMenuOpen(false); }}>
              Пользователи
            </button>
          </>
        )}
      </nav>

      <main className="app-main">
        {tab === 'board' && (
          <>
            <div className="corpus-tabs">
              {corpuses.map((c) => (
                <button
                  key={c.id}
                  className={`corpus-tab ${activeCorpusId === c.id ? 'active' : ''}`}
                  onClick={() => setActiveCorpusId(c.id)}
                >
                  {c.name} ({corpusProgress[c.id]?.done || 0}/{corpusProgress[c.id]?.total || 0})
                </button>
              ))}
              {corpuses.length === 0 && (
                <p className="empty-hint">
                  {isAdmin ? 'Структура пока пуста. Перейдите в раздел «Структура», чтобы добавить корпус.' : 'Структура объекта ещё не настроена администратором.'}
                </p>
              )}
            </div>

            {activeCorpus && (
              <>
                <CorpusStatsBlock title={activeCorpus.name} units={corpusUnits} />
                <FiltersBar
                  search={search}
                  setSearch={setSearch}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterType={filterType}
                  setFilterType={setFilterType}
                />
                <ChessBoard
                  corpus={activeCorpus}
                  units={filteredUnits}
                  onUnitClick={setSelectedUnit}
                />
              </>
            )}
          </>
        )}

        {tab === 'stats' && <StatsPage corpuses={corpuses} units={units} />}

        {tab === 'structure' && isAdmin && (
          <StructurePage
            corpuses={corpuses}
            units={units}
            onAddCorpus={handleAddCorpus}
            onRenameCorpus={handleRenameCorpus}
            onDeleteCorpus={handleDeleteCorpus}
            onAddFloor={handleAddFloor}
            onDeleteFloor={handleDeleteFloor}
            onAddUnit={handleAddUnitFromStructure}
            onDeleteUnit={handleDeleteUnit}
          />
        )}

        {tab === 'users' && isAdmin && <UsersPage currentUid={firebaseUser?.uid} />}
      </main>

      {selectedUnit && (
        <UnitModal
          unit={units.find((u) => u.id === selectedUnit.id) || selectedUnit}
          corpusName={activeCorpus?.name}
          isAdmin={isAdmin}
          onClose={() => setSelectedUnit(null)}
          onUpdate={handleUpdateUnit}
          onDelete={(id) => {
            handleDeleteUnit(id);
            setSelectedUnit(null);
          }}
        />
      )}
    </div>
  );
}

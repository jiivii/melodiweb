const SUPABASE_URL = 'https://qgcywuzantcgoitrybwb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DtYokgl1tTfps9MslC41LQ_l5SdvBG3';
const PROFESSIONAL_ID = "a6be4177-3195-4885-a27c-0a7259ce1858";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
async function testSlots() {
  const { data, error } = await supabaseClient
    .from('appointments_slots_public')
    .select('*')
    .limit(10);

  console.log(data);
  console.error(error);
}

testSlots();

async function getSlotsOcupados(professionalId, fromISO, toISO) {
  if (!supabase) return [];
  const { data, error } = await supabaseClient
    .from('appointments_slots_public')
    .select('professional_id,date,status')
    .eq('professional_id', professionalId)
    .gte('date', fromISO)
    .lte('date', toISO);

  if (error) {
    console.error('Error fetching slots:', error);
    return [];
  }
  return data || [];
}

async function getOrCreatePatient({ first_name, last_name, email, phone }) {
  const dummyDni = `TEMP-${crypto.randomUUID()}`;

  const { data: existing } = await supabaseClient
    .from('patients')
    .select('id')
    .eq('dni', dummyDni)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data, error } = await supabaseClient
    .from('patients')
    .insert([{
      dni: dummyDni,
      first_name,
      last_name,
      phone: phone || null,
      email: email || null
    }])
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

async function reservar({
  first_name,
  last_name,
  email,
  phone,
  birth_date,
  dni,
  dateISO,
  reason
}) {

  const { data, error } = await supabaseClient.rpc(
    'create_public_appointment',
    {
      p_first_name: first_name,
      p_last_name: last_name,
      p_email: email || null,
      p_phone: phone || null,
      p_birth_date: birth_date || null,
      p_dni: dni || null,
      p_date: dateISO,
      p_reason: reason || null
    }
  );


  if (error) {
    console.error('Error creando cita:', error);
    throw error;
  }


  return data;
}

// Lógica de UI para contacto.html
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('booking-date');
  if (!dateInput) return; // Solo ejecutar si estamos en la página de reservas

  const slotsContainer = document.getElementById('booking-slots');
  const bookingFormContainer = document.getElementById('booking-form-container');
  const bookingForm = document.getElementById('booking-form');
  const selectedDateStr = document.getElementById('selected-date-str');
  const selectedTimeStr = document.getElementById('selected-time-str');
  const bookingSuccess = document.getElementById('booking-success');
  let selectedDateTime = null;

  // Evitar fechas pasadas
  const today = new Date();
  // Formatear hoy como YYYY-MM-DD
  const offset = today.getTimezoneOffset()
  const todayStr = new Date(today.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
  dateInput.min = todayStr;

  dateInput.addEventListener('change', async (e) => {
    const selectedDateStrVal = e.target.value;
    if (!selectedDateStrVal) return;

    // Al usar input type=date, el valor viene en YYYY-MM-DD, que se interpreta como UTC si usamos new Date()
    // Lo ideal es parsearlo considerando la zona horaria local o forzarlo.
    const [y, m, d] = selectedDateStrVal.split('-');
    const selectedDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));

    // No permitir fines de semana
    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
      slotsContainer.innerHTML = '<p class="form-error">Por favor, selecciona un día de lunes a viernes.</p>';
      bookingFormContainer.style.display = 'none';
      return;
    }

    slotsContainer.innerHTML = '<p class="loading-text">Cargando horas disponibles...</p>';
    bookingFormContainer.style.display = 'none';

    // Generar huecos base: 9:00 - 14:00 y 16:00 - 20:00 (cada 1 hora)
    const baseSlots = [];
    for (let i = 9; i <= 13; i++) {
      const dSlot = new Date(selectedDate);
      dSlot.setHours(i, 0, 0, 0);
      baseSlots.push(dSlot);
    }
    for (let i = 16; i <= 19; i++) {
      const dSlot = new Date(selectedDate);
      dSlot.setHours(i, 0, 0, 0);
      baseSlots.push(dSlot);
    }

    // Consultar ocupados
    const fromDate = new Date(selectedDate);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(selectedDate);
    toDate.setHours(23, 59, 59, 999);

    // Asegurarse de que mandamos UTC a supabase, ya que toISOString() convierte a UTC
    const fromISO = fromDate.toISOString();
    const toISO = toDate.toISOString();

    const ocupados = await getSlotsOcupados(PROFESSIONAL_ID, fromISO, toISO);

    // Convertir ocupados a getTime() de fecha local
    const ocupadosHoras = ocupados.map(o => new Date(o.date).getTime());

    slotsContainer.innerHTML = '';

    const availableSlots = baseSlots.filter(slot => !ocupadosHoras.includes(slot.getTime()));

    if (availableSlots.length === 0) {
      slotsContainer.innerHTML = '<p class="form-error">No hay horas disponibles en este día.</p>';
      return;
    }

    const slotsGrid = document.createElement('div');
    slotsGrid.className = 'slots-grid';

    availableSlots.forEach(slot => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      // Solo mostrar hora
      btn.textContent = slot.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      btn.addEventListener('click', () => {
        // Deseleccionar otros
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        selectedDateTime = slot;
        selectedDateStr.textContent = slot.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        selectedTimeStr.textContent = btn.textContent;

        bookingFormContainer.style.display = 'block';
        // Animación suave
        bookingFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      slotsGrid.appendChild(btn);
    });

    slotsContainer.appendChild(slotsGrid);
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!selectedDateTime) return;

      const btn = bookingForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Procesando reserva...';

      const first_name = document.getElementById('b-nombre').value;
      const last_name = document.getElementById('b-apellidos').value;
      const email = document.getElementById('b-email').value;
      const phone = document.getElementById('b-telefono').value;
      const reason = document.getElementById('b-mensaje').value;

      try {
        const patientId = await getOrCreatePatient({ first_name, last_name, email, phone });
        await reservar({
          patient: patientId,
          professionalId: PROFESSIONAL_ID,
          dateISO: selectedDateTime.toISOString(), // Guardado en UTC en Supabase
          reason
        });

        bookingForm.style.display = 'none';
        // Mostrar mensaje de éxito superior
        bookingFormContainer.innerHTML = '';
        bookingSuccess.style.display = 'block';
      } catch (error) {
        console.error(error);
        alert('Hubo un error al procesar tu reserva. Por favor, inténtalo de nuevo más tarde.');
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }
});
